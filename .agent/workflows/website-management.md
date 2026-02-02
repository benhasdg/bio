---
description: Complete guide for editing, posting, and managing this personal website
---

# Personal Website Management

This workflow documents how to manage, edit, and publish content to this personal website - a clean, modern portfolio site built with vanilla HTML/CSS/JavaScript.

## Website Overview

**Technology:** Static HTML/CSS/JavaScript with dark mode support  
**Deployment:** GitHub Pages via `https://github.com/benhasdg/bio.git`  
**Design:** Modern, minimalist aesthetic with custom CSS variables for theming

### Site Structure

```
2602personalSite1/
├── index.html              # Main homepage/portfolio
├── favicon.png             # Site favicon
├── CNAME                   # Custom domain configuration
├── news/                   # News articles directory
│   ├── 2026-kitchen-renovation.html
│   ├── 2026-hub-launch.html
│   ├── 2026-data-analytics.html
│   ├── 2020-patio-project.html
│   └── assets/            # Images and media for articles
│       ├── kitchenrenoimages/
│       ├── patio-before.jpg
│       └── ...
└── .git/                  # Git repository
```

## Design System

### Color Palette

**Light Theme:**
- Background: `#f2ebe1` (creamy white)
- Text: `#111` (near black)
- Accent: `#e9a65a` (warm orange)
- Secondary: `#84a59d` (muted teal/sage)

**Dark Theme:**
- Background: `#1a1c1c` (dark sage)
- Text: `#f2ebe1` (creamy white)
- Accent: `#f2bc7d` (lighter orange)
- Secondary: `#a7c4bc` (lighter teal)

### Typography
- Primary font: Inter (with system font fallbacks)
- Monospace: System monospace (for dates and technical content)
- Large headings: 800 weight, tight letter spacing (-0.04em)

---

## Editing the Homepage

### File: `index.html`

#### Update About Section

**Location:** Lines 319-327

```html
<section id="about">
    <h3>About</h3>
    <p style="font-size: 1.2rem; font-weight: 400; color: var(--text);">
        [Your bio text here]
    </p>
</section>
```

#### Add News Item

**Location:** Lines 329-357 (within `<section id="news">`)

Add new items at the **top** of the `<ul class="news-list">` to maintain reverse chronological order:

```html
<li class="news-item">
    <a href="news/YYYY-article-slug.html">
        <span class="news-title">Your Article Title</span>
        <span class="news-date">MMM DD, YYYY</span>
    </a>
</li>
```

**Date format:** All caps, three-letter month abbreviation, e.g., `JAN 30, 2026`

#### Update Experience

**Location:** Lines 359-389 (within `<section id="experience">`)

Each job is contained in a `.job` div:

```html
<div class="job">
    <div class="job-header">
        <span class="job-title">Job Title</span>
        <span class="job-date">YYYY – PRES</span>
    </div>
    <div class="job-company">Company Name</div>
    <ul>
        <li>Responsibility or achievement</li>
        <li>Another responsibility</li>
    </ul>
</div>
```

#### Update Skills

**Location:** Lines 391-407 (within `<section id="skills">`)

```html
<div class="skill-cat">
    <strong>Category Name</strong>
    <span>Specific skills, tools, platforms</span>
</div>
```

---

## Managing Images and Media

### Organization

- **Single article images:** Create a dedicated folder in `news/assets/`
  - Example: `news/assets/kitchenrenoimages/`
- **Shared images:** Place directly in `news/assets/` (e.g., `patio-before.jpg`)

### Image Best Practices

1. **Naming:** Use descriptive names or original camera file names
2. **Size:** Optimize for web (typically < 500KB per image)
3. **Alt text:** Always provide descriptive alt attributes for accessibility
4. **Captions:** Use `.image-caption` class for contextual information

### Responsive Images

- **Single images:** Use `.image-container` wrapper (full width, rounded corners, shadow)
- **Grid layout:** Use `.grid` for two-column layouts (responsive: stacks on mobile)
- **Inline styles:** Add `width:100%; border-radius:8px; box-shadow: 0 6px 20px rgba(0,0,0,0.08);` to grid images

### Lightbox Functionality

All article images automatically support click-to-zoom via the included JavaScript. No additional configuration needed.

---

## Content Writing Guidelines

### Voice and Tone

The site uses a casual, technically-oriented voice that:
- Explains technical concepts conversationally
- Makes comparisons to software/web development
- Balances professionalism with personality

Example: *"Like refactoring legacy code, sometimes you need to go back to the foundation to build something that lasts."*

### Article Structure

1. **Opening:** Brief introduction to the project/topic
2. **Context:** Why this matters or how it started
3. **Process:** Step-by-step walkthrough with images
4. **Technical details:** Specific materials, methods, or techniques
5. **Reflection:** What was learned or why it matters

### SEO Considerations

- **Title tag:** Format as `Article Title | Ben Heine`
- **Meta description:** Add description meta tag for better search results
- **Alt text:** Descriptive, keyword-relevant alt attributes on all images
- **Headings:** Use semantic H1 for title only, paragraphs for body content

---

## Troubleshooting

### Common Issues

**Theme toggle not working:**
- Ensure the JavaScript at the bottom of the page is present
- Check browser console for errors
- Verify `id` attributes match: `theme-toggle`, `toggle-icon`

**Images not displaying:**
- Check relative path: `assets/folder/image.jpeg` (NOT `/assets/...`)
- Verify file exists in the correct location
- Check file name case sensitivity (macOS is case-insensitive, servers often aren't)

**Lightbox not working:**
- Confirm lightbox overlay div exists before closing `</body>`
- Verify lightbox JavaScript is included
- Check that images have the correct selectors: `.image-container img, .grid img`

**Site not updating after push:**
- Wait 2-3 minutes for GitHub Pages deployment
- Hard refresh browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- Check GitHub repository Actions tab for deployment status

**Mobile responsiveness issues:**
- Test media query at `@media (max-width: 600px)`
- Verify grid switches to single column: `grid-template-columns: 1fr`

---

## Quick Reference

### File Locations

- **Homepage:** `index.html`
- **News articles:** `news/*.html`
- **Article images:** `news/assets/`
- **Favicon:** `favicon.png` (root directory)

### Key CSS Classes

- `.news-item` - News list item
- `.job` - Experience/job container
- `.skill-cat` - Skill category card
- `.image-container` - Single image wrapper with caption support
- `.grid` - Two-column responsive grid
- `.image-caption` - Image/video caption styling
- `.lightbox-overlay` - Click-to-zoom overlay

### Important Variables

```css
--bg: Background color
--text: Primary text color
--accent: Warm orange accent (links, highlights)
--secondary: Teal/sage secondary color
--muted: Muted gray for dates and less important text
--card-bg: Card/component background
```

---

## Advanced Customization

### Adding New Sections

To add a new section to the homepage:

1. Follow the existing `<section>` structure
2. Use an `<h3>` heading with `::after` pseudo-element for the line effect
3. Add appropriate `id` attribute for potential anchor links
4. Maintain 5rem bottom margin for consistency

### Modifying the Color Scheme

Edit the CSS custom properties in the `:root` and `[data-theme="dark"]` selectors:

```css
:root {
    --accent: #e9a65a;      /* Change accent color */
    --secondary: #84a59d;    /* Change secondary color */
    /* etc. */
}
```

All instances will update automatically.

### Creating Different Article Layouts

You can create custom layouts by:
- Using different grid configurations: `grid-template-columns: 1fr 1fr 1fr` for three columns
- Adding custom CSS in the article's `<style>` block
- Creating new wrapper classes for specific content types

---

*See also: [publish-article.md](./publish-article.md) for step-by-step article publishing workflow*
*See also: [deploy.md](./deploy.md) for Git deployment workflow*
