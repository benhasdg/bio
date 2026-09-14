const toggle = document.getElementById('theme-toggle');
const icon = document.getElementById('toggle-icon');

const applyTheme = (theme) => {
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        icon.textContent = '\u263E'; // ☾ — click for evening
    } else {
        document.documentElement.removeAttribute('data-theme');
        icon.textContent = '\u2600'; // ☀ — click for morning
    }
};

const stored = localStorage.getItem('theme');
const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
applyTheme(stored || (prefersLight ? 'light' : 'dark'));

toggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const next = isLight ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
});
