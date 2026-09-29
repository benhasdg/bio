// "Get twisted" background: a full-screen WebGL shader at full device
// resolution. Each pixel runs a kaleidoscope, three levels of 8-octave
// domain-warped noise and a 96-step fractal fold. It is heavy on purpose,
// but tuned to stay watchable on a recent phone.
//
// Resolution adapts: it starts at full device pixels, steps down
// while frames take longer than 50 ms and back up when there is headroom,
// so slower GPUs trade sharpness for
// smoothness instead of dropping to a slideshow.
//
// Loop counts are uniforms rather than constants so shader compilers (the
// Direct3D one in particular) can't unroll them into a program that takes
// minutes to compile. Compilation runs in the background where the browser
// supports it, so turning the mode on never freezes the page.
//
// Guards:
// - Software renderers, and GPUs whose probe frame projects to more than
//   1.5 s, get the CSS pinwheel instead.
// - If three frames in a row take over 1.5 s, it drops to the pinwheel.
// - The mode is never remembered, so a reload always turns it off.
//
// It pauses when the tab is hidden and draws one still frame for visitors
// who prefer reduced motion.
(() => {
    const root = document.documentElement;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const LIMIT_MS = 1500;
    const OCTAVES = 8;
    const FOLDS = 96;
    const SAMPLES = 1; // per axis; 2 (2x2 supersampling) measured ~20x slower
    const MAX_DPR = 3;
    const TARGET_MS = 50; // step resolution down while frames are slower than this
    const MIN_SCALE = 0.35; // never below 35% of full resolution

    const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
    const FRAG = `
precision highp float;
uniform vec2 r;
uniform float t;
uniform int octaves;
uniform int folds;
uniform int samples;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3. - 2. * f);
    return mix(mix(hash(i), hash(i + vec2(1., 0.)), u.x),
               mix(hash(i + vec2(0., 1.)), hash(i + vec2(1., 1.)), u.x), u.y);
}

float fbm(vec2 p) {
    float v = 0., a = .5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 16; i++) {
        if (i >= octaves) break;
        v += a * noise(p); p = m * p; a *= .5;
    }
    return v;
}

vec3 palette(float x) {
    return .5 + .5 * cos(6.28318 * (x + vec3(0., .33, .67)));
}

vec3 scene(vec2 px) {
    vec2 uv = (px - .5 * r) / min(r.x, r.y);
    float rad = length(uv);

    // Kaleidoscope with a slowly changing number of mirrors
    float seg = 6.28318 / (6. + 3. * sin(t * .2));
    float a = mod(atan(uv.y, uv.x) + t * .1, seg);
    a = abs(a - seg * .5);
    uv = vec2(cos(a), sin(a)) * rad * (1.5 + .5 * sin(t * .3));

    // Domain warping, three levels deep
    vec2 q = vec2(fbm(uv + t * .1), fbm(uv + vec2(5.2, 1.3) - t * .12));
    vec2 w = vec2(fbm(uv + 4. * q + vec2(1.7, 9.2) + t * .15),
                  fbm(uv + 4. * q + vec2(8.3, 2.8) - t * .1));
    float f = fbm(uv + 4. * w + t * .05);

    // Fractal fold
    vec2 z = uv * 1.2 + w * .3;
    float acc = 0.;
    for (int i = 0; i < 256; i++) {
        if (i >= folds) break;
        z = abs(z) / dot(z, z) - vec2(.9 + .1 * sin(t * .23), .6 + .1 * cos(t * .17));
        acc += exp(-abs(length(z) - 1.) * 6.);
    }

    vec3 col = palette(f * 2. + acc * .03 + t * .08 + rad);
    col *= .6 + .4 * sin(rad * 40. - t * 4. + f * 10.);
    col += palette(acc * .05 + t * .05) * clamp(acc * .02, 0., 1.);
    return col;
}

void main() {
    vec3 col = vec3(0.);
    float n = 0.;
    for (int y = 0; y < 4; y++) {
        if (y >= samples) break;
        for (int x = 0; x < 4; x++) {
            if (x >= samples) break;
            vec2 o = (vec2(float(x), float(y)) + .5) / float(samples) - .5;
            col += scene(gl_FragCoord.xy + o);
            n += 1.;
        }
    }
    gl_FragColor = vec4(col / n, 1.);
}`;

    let canvas = null, gl = null, raf = 0, start = 0, last = 0, slow = 0;
    let scale = 1, sum = 0, count = 0;
    let state = 'off'; // off | compiling | running | failed
    const u = {};

    const fail = () => {
        state = 'failed';
        teardown();
    };

    const teardown = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        if (canvas) {
            const lose = gl && gl.getExtension('WEBGL_lose_context');
            if (lose) lose.loseContext();
            canvas.remove();
        }
        canvas = gl = null;
        start = last = slow = sum = count = 0;
        scale = 1;
        // Guarded: classList.remove rewrites the attribute even when the class
        // is absent, which would retrigger the observer below
        if (root.classList.contains('twist-gl')) root.classList.remove('twist-gl');
    };

    const dprNow = () => Math.min(window.devicePixelRatio || 1, MAX_DPR) * scale;

    // Step 1: create the context and start compiling
    const begin = () => {
        canvas = document.createElement('canvas');
        canvas.className = 'twist-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        gl = canvas.getContext('webgl', { antialias: false, powerPreference: 'high-performance' });
        if (!gl) return fail();

        const info = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
        if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) return fail();

        // Only a loss while we're using it counts; untwisting releases the
        // context on purpose and shouldn't disable the shader
        canvas.addEventListener('webglcontextlost', (e) => {
            e.preventDefault();
            if (state === 'running' || state === 'compiling') fail();
        });

        const prog = gl.createProgram();
        [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]].forEach(([type, src]) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            gl.attachShader(prog, s);
        });
        gl.linkProgram(prog);

        state = 'compiling';
        const parallel = gl.getExtension('KHR_parallel_shader_compile');
        const wait = () => {
            if (state !== 'compiling' || !gl) return;
            if (parallel && !gl.getProgramParameter(prog, parallel.COMPLETION_STATUS_KHR)) {
                raf = requestAnimationFrame(wait);
                return;
            }
            ready(prog);
        };
        wait();
    };

    // Step 2: bind everything, probe the speed, then start drawing
    const ready = (prog) => {
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return fail();
        gl.useProgram(prog);

        gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(prog, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
        ['r', 't', 'octaves', 'folds', 'samples'].forEach((k) => { u[k] = gl.getUniformLocation(prog, k); });
        gl.uniform1i(u.octaves, OCTAVES);
        gl.uniform1i(u.folds, FOLDS);
        gl.uniform1i(u.samples, SAMPLES);

        // Time one small frame and project it to full size
        const probe = 128;
        canvas.width = canvas.height = probe;
        gl.viewport(0, 0, probe, probe);
        gl.uniform2f(u.r, probe, probe);
        gl.uniform1f(u.t, 1);
        const pixel = new Uint8Array(4);
        gl.drawArrays(gl.TRIANGLES, 0, 3); // warm-up
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        const t0 = performance.now();
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
        const full = window.innerWidth * window.innerHeight * dprNow() ** 2;
        if ((performance.now() - t0) * full / (probe * probe) > LIMIT_MS) return fail();

        document.body.prepend(canvas);
        root.classList.add('twist-gl');
        state = 'running';
        start = performance.now();
        raf = requestAnimationFrame(frame);
    };

    const frame = (now) => {
        if (state !== 'running') return;
        if (last) {
            const dt = now - last;
            if (dt > LIMIT_MS) {
                if (++slow >= 3) return fail();
            } else {
                slow = 0;
            }
            // Every 20 frames, adjust resolution: down if the average was too
            // slow, back up if there's headroom (e.g. after a window was
            // hidden behind others and the browser throttled it)
            sum += dt;
            if (++count === 20) {
                const avg = sum / count;
                if (avg > TARGET_MS && scale > MIN_SCALE) scale = Math.max(MIN_SCALE, scale * 0.8);
                else if (avg < TARGET_MS / 2 && scale < 1) scale = Math.min(1, scale * 1.25);
                sum = count = 0;
            }
        }
        last = now;

        const w = Math.round(window.innerWidth * dprNow());
        const h = Math.round(window.innerHeight * dprNow());
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
        }
        gl.uniform2f(u.r, w, h);
        gl.uniform1f(u.t, (now - start) / 1000);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        if (!still) raf = requestAnimationFrame(frame);
    };

    const sync = () => {
        const on = root.classList.contains('twisted');
        if (!on) {
            if (state !== 'failed') state = 'off';
            teardown();
            return;
        }
        if (state === 'failed') return;
        if (state === 'off') begin();
        else if (state === 'running') {
            cancelAnimationFrame(raf);
            last = 0;
            if (!document.hidden) raf = requestAnimationFrame(frame);
        }
    };

    // React only when "twisted" actually flips, not to every class write
    let wasOn = false;
    new MutationObserver(() => {
        const on = root.classList.contains('twisted');
        if (on !== wasOn) { wasOn = on; sync(); }
    }).observe(root, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('resize', () => {
        if (state === 'running' && still) raf = requestAnimationFrame(frame);
    });
})();
