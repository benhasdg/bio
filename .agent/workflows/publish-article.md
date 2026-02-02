---
description: Step-by-step workflow for creating and publishing a new article
---

# Publish New Article

This workflow guides you through creating and publishing a new article to the website.

## Prerequisites

- Article content written
- Images/videos ready and optimized for web (< 500KB per image)
- Article slug decided (e.g., `2026-my-article`)

---

## Step 1: Create Image Folder

```bash
mkdir -p "news/assets/article-name-images"
```

Replace `article-name-images` with a descriptive folder name for your article.

## Step 2: Add Images

Copy your images into the folder you just created:

```bash
cp /path/to/your/images/* "news/assets/article-name-images/"
```

**Supported formats:** JPEG, PNG, MOV (for video)

---

## Step 3: Create Article HTML File

Create a new file: `news/YYYY-article-slug.html`

Example: `news/2026-kitchen-renovation.html`

### Article Template

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Title | Ben Heine</title>
    <link rel="icon" type="image/png" href="../favicon.png">
    <style>
        /* Copy the entire <style> block from an existing news article */
        /* Example: news/2026-kitchen-renovation.html */
    </style>
</head>

<body>
    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
        <span id="toggle-icon">🌙</span>
    </button>
    <a href="/" class="back">← Back to Home</a>
    <span class="date">MONTH YEAR</span>
    <h1>Your Article Title</h1>

    <article>
        <p>Opening paragraph...</p>

        <!-- Single image with caption -->
        <div class="image-container">
            <img src="assets/article-name-images/image.jpeg" alt="Descriptive alt text">
            <p class="image-caption">Caption describing the image</p>
        </div>

        <p>More content...</p>

        <!-- Two-column image grid -->
        <div class="grid">
            <div>
                <img src="assets/article-name-images/image1.jpeg" alt="Description"
                    style="width:100%; border-radius:8px; box-shadow: 0 6px 20px rgba(0,0,0,0.08);">
            </div>
            <div>
                <img src="assets/article-name-images/image2.jpeg" alt="Description"
                    style="width:100%; border-radius:8px; box-shadow: 0 6px 20px rgba(0,0,0,0.08);">
            </div>
        </div>

        <!-- Video (optional) -->
        <div class="image-container">
            <video controls>
                <source src="assets/article-name-images/video.mov" type="video/mp4">
                Your browser does not support the video tag.
            </video>
            <p class="image-caption">Video caption</p>
        </div>
    </article>

    <!-- Lightbox overlay (required for click-to-zoom) -->
    <div class="lightbox-overlay" id="lightbox">
        <img class="lightbox-image" id="lightbox-img" src="" alt="">
    </div>

    <footer>&copy; 2026 Ben Heine. Crafted by MoltBot MB.</footer>

    <script>
        /* Copy the entire <script> block from an existing news article */
        /* Includes theme toggle and lightbox functionality */
    </script>
</body>

</html>
```

---

## Step 4: Update Homepage

Edit `index.html` and add your article link at the **top** of the news list (around line 332):

```html
<li class="news-item">
    <a href="news/2026-your-article.html">
        <span class="news-title">Your Article Title</span>
        <span class="news-date">MMM DD, YYYY</span>
    </a>
</li>
```

**Date format:** All caps, three-letter month, e.g., `JAN 30, 2026`

---

## Step 5: Test Locally

Open the article in your browser to verify:

```bash
open "news/YYYY-article-slug.html"
```

**Check:**
- [ ] All images load correctly
- [ ] Theme toggle works (light/dark mode)
- [ ] Lightbox zoom works when clicking images
- [ ] "Back to Home" link works
- [ ] Mobile responsive layout (resize browser)
- [ ] All alt text is descriptive
- [ ] No typos in content

---

## Step 6: Commit and Push

// turbo
```bash
cd "/Users/bheine/Library/Mobile Documents/com~apple~CloudDocs/Scripts/2602personalSite1"
```

// turbo
```bash
git status
```

// turbo
```bash
git add .
```

```bash
git commit -m "Add [article title] article with images"
```

```bash
git push origin main
```

---

## Step 7: Verify Deployment

Wait 2-3 minutes for GitHub Pages to deploy, then:

1. Visit your live site
2. Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. Click the new article link
4. Test on mobile device if possible

---

## Troubleshooting

**Images not showing:**
- Verify relative path: `assets/folder-name/image.jpeg`
- Check file names match exactly (case-sensitive on servers)
- Ensure images are in the correct folder

**Article not appearing on homepage:**
- Check you added the link in the right `<ul class="news-list">` section
- Verify the `href` path is correct: `news/filename.html`
- Make sure you saved and committed `index.html`

**Site not updating:**
- Wait a few more minutes
- Check GitHub repository for deployment status
- Try hard refresh in browser

---

**See also:** [website-management.md](./website-management.md) for detailed content guidelines and styling options
