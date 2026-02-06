---
description: Git workflow for deploying website changes to GitHub Pages
---

# Deploy Website

This workflow covers the Git commands for deploying changes to your live website via GitHub Pages.

## Repository Information

- **Remote:** `https://github.com/benhasdg/bio.git`
- **Branch:** `main`
- **Deployment:** Automatic via GitHub Pages (2-3 minutes after push)

---

## Standard Deployment Workflow

### 1. Navigate to Project Directory

// turbo
```bash
cd "/Users/bheine/Library/Mobile Documents/com~apple~CloudDocs/Scripts/2602personalSite1"
```

### 2. Check Current Status

// turbo
```bash
git status
```

This shows:
- Modified files (red)
- Untracked files (red)
- Staged files (green)

### 3. Stage Changes

**Stage all changes:**
// turbo
```bash
git add .
```

**Stage specific files:**
```bash
git add index.html
git add css/shared.css css/home.css css/article.css
git add js/theme-toggle.js js/lightbox.js
git add news/2026-my-article.html
git add news/assets/article-images/
```

### 4. Review Staged Changes

// turbo
```bash
git diff --staged
```

### 5. Commit Changes

```bash
git commit -m "Your descriptive commit message"
```

**Good commit messages:**
- `"Add kitchen renovation article with images"`
- `"Update about section and add new skill"`
- `"Fix broken image links in patio article"`

**Bad commit messages:**
- `"update"` (too vague)
- `"fix stuff"` (not descriptive)

### 6. Push to GitHub

```bash
git push origin main
```

### 7. Verify Deployment

1. Wait 2-3 minutes
2. Visit your live site
3. Hard refresh: `Cmd + Shift + R`
4. Verify changes are live

---

## Common Git Commands

### View Commit History

// turbo
```bash
git log --oneline -10
```

Shows last 10 commits in compact format.

### View Detailed Diff

// turbo
```bash
git diff
```

Shows line-by-line changes for unstaged files.

### Undo Uncommitted Changes

**Undo changes to a specific file:**
```bash
git checkout -- filename.html
```

**Undo all uncommitted changes (DESTRUCTIVE):**
```bash
git reset --hard HEAD
```

⚠️ **Warning:** This permanently deletes all uncommitted changes!

### Unstage Files

```bash
git reset HEAD filename.html
```

Removes file from staging area, but keeps your changes.

---

## Branch Management

### Create a Feature Branch

For major changes, work on a branch:

```bash
git checkout -b feature/new-design
```

### Switch Between Branches

```bash
git checkout main
git checkout feature/new-design
```

### Merge Branch into Main

```bash
git checkout main
git merge feature/new-design
```

### Delete Branch After Merge

```bash
git branch -d feature/new-design
```

---

## Troubleshooting

### Push Rejected (Conflicts)

If someone else pushed changes:

```bash
git pull origin main
```

Resolve any conflicts, then:

```bash
git add .
git commit -m "Merge remote changes"
git push origin main
```

### Accidentally Committed Wrong Files

**Undo last commit (keep changes):**
```bash
git reset --soft HEAD~1
```

**Undo last commit (discard changes):**
```bash
git reset --hard HEAD~1
```

### View Remote Repository Info

// turbo
```bash
git remote -v
```

### Check Current Branch

// turbo
```bash
git branch
```

The current branch has an asterisk (*).

---

## Deployment Checklist

Before pushing to production:

- [ ] Test all changes locally
- [ ] All images load correctly
- [ ] No broken links
- [ ] Theme toggle works
- [ ] Mobile responsive
- [ ] Commit message is descriptive
- [ ] Reviewed `git diff --staged`

---

## Quick Deploy (Common Case)

For quick updates where you're confident in changes:

// turbo-all

```bash
cd "/Users/bheine/Library/Mobile Documents/com~apple~CloudDocs/Scripts/2602personalSite1"
git status
git add .
```

```bash
git commit -m "Your commit message here"
git push origin main
```

Then wait 2-3 minutes and verify the live site.

---

**See also:** [website-management.md](./website-management.md) for general website documentation
