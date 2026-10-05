# Ben Heine Personal Website

Static personal/portfolio website for Ben Heine, deployed with GitHub Pages at `www.bheine.net` from the GitHub repository `https://github.com/benhasdg/bio.git`.

## What this project is

This is a lightweight static site built with plain HTML, CSS, and JavaScript. There is no build system, package manager, framework, or server-side code required.

Main features:

- Portfolio/resume homepage
- News/article pages
- Click-to-zoom lightbox for article images
- GitHub Pages deployment using the root-level `CNAME` file

## Design: Toejam & Earl

The soft, gloopy side of the game. The page is a lumpy island with scalloped grass on top and pink goo dripping off the bottom. Its edges wobble through SVG displacement filters (inlined at the top of each page's `<body>`).

- **World:** light mode tiles `img/lawn.svg` (grass, flowers, a lake, a cliff). Space mode tiles `img/squiggle.svg` (the intro's purple wallpaper, with weird green glyphs). Both scroll diagonally.
- **Type:** Titan One for outlined bubble titles, Chewy for menu, dates and small labels, Nunito for reading (Google Fonts).
- **Shapes:** uneven "blob" corners everywhere. Dates, the sidebar and block quotes are the game's black dialogue boxes with dotted lime borders. The mascot in the masthead is `img/tv.svg`.
- **Animation:** the title bounces in once, the TV bobs, buttons squish like jelly on hover with a blinking pointer, and the background scrolls. The goo drips, dialogue boxes morph between lumpy shapes, headings sway, and sections squash in on load. All of it stops under `prefers-reduced-motion`.
- **Day / space mode:** a toggle in the nav (`js/theme.js`). A small inline script in each page's `<head>` applies the saved choice, or the system setting, before the page paints.
- **Get twisted:** the nav's "get twisted" link fills the viewport with a heavy WebGL shader (`js/twist.js`: kaleidoscope, domain-warped noise and a 96-step fractal fold at full device resolution) under pulsing CSS rings, with the page content layered on top. Resolution steps down automatically on GPUs that can't hold about 20 fps. It is never remembered, so a reload turns it off. Visitors with reduced motion get it at under a third of the speed rather than a still frame; software renderers and GPUs that would take over 1.5 s a frame get a CSS pinwheel instead. Tuning constants are at the top of `js/twist.js`.
- Design tokens live in `css/shared.css` under `:root`.

## Project structure

```text
2607personalSite2/
├── index.html                     # Homepage / portfolio page
├── CNAME                          # Custom domain: www.bheine.net
├── favicon.png                    # Site icon
├── css/
│   ├── shared.css                 # Global theme variables and base styles
│   ├── home.css                   # Homepage-specific styles
│   └── article.css                # Article/news page styles
├── js/
│   └── lightbox.js                # Article image lightbox behavior
├── news/
│   ├── 2020-patio-project.html
│   ├── 2026-kitchen-renovation.html
│   └── assets/                    # Article media
└── .agent/workflows/              # Editing/deploy workflow notes
```

## Editing the site

### Homepage

Edit `index.html` for:

- About text
- Contact links
- News links
- Experience
- Expertise/skills
- Footer text

Homepage styling lives in:

- `css/shared.css` for global colors, typography, and base styles
- `css/home.css` for homepage layout and animations

### Articles

Article files live in `news/`.

Current articles:

- `news/2026-long-receipt.html`
- `news/2026-embiggen.html`
- `news/2026-tump.html`
- `news/2026-tickr.html`
- `news/2026-kitchen-renovation.html`
- `news/2020-patio-project.html`

Article styling lives in `css/article.css`.

When adding an article:

1. Create a new `news/YYYY-article-slug.html` file.
2. Add related images/video under `news/assets/`.
3. Add the post to `blog.html`, and to the Recent posts list in `index.html` (keep it at four).
4. Test image paths and theme/lightbox behavior locally.

More detailed article instructions are in `.agent/workflows/publish-article.md`.

## Local preview

Because this is a static site, you can open `index.html` directly in a browser.

For a better local preview from the project root:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Deployment

Deployment is via GitHub Pages. Standard workflow:

```bash
git status
git add .
git commit -m "Describe the website update"
git push origin main
```

GitHub Pages should publish the update after a few minutes.

Detailed deployment notes are in `.agent/workflows/deploy.md`.

## Media notes

Keep article media optimized for the web. Target less than 500 KB per image when possible.

Current active media includes:

- Tickr post images in `news/assets/tickr/`
- Patio project images in `news/assets/`
- Kitchen renovation images/video in `news/assets/kitchenrenoimages/`

The kitchen renovation video uses the MP4 version only: `countertop2.mp4`.

## Cleanup performed

Unused/unreferenced media was removed from the project:

- `news/assets/patio-progress-2.jpg`
- `news/assets/kitchenrenoimages/IMG_1998 Large.jpeg`
- `news/assets/kitchenrenoimages/IMG_2026 Large.jpeg`
- `news/assets/kitchenrenoimages/IMG_2144 Large.jpeg`
- `news/assets/kitchenrenoimages/IMG_2148 Large.jpeg`
- `news/assets/kitchenrenoimages/countertop2.mov`

`countertop2.mov` duplicated the MP4 video purpose and was much larger, so the article now uses only `countertop2.mp4`.

## Notes for future maintenance

- Keep `CNAME` if using `www.bheine.net`.
- Keep `.gitignore`; it currently ignores `.DS_Store`.
- Keep `.agent/workflows/` unless you no longer want the local workflow documentation.
- When removing media, search the HTML files first to confirm the asset is not referenced.

## GIFs

Posts embed GIFs with Tenor's official embed (`div.tenor-gif-embed` plus `https://tenor.com/embed.js`), so no GIF files are stored in the repo. Without JavaScript the embed falls back to a plain link.
