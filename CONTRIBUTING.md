# Contributing to word-bibliography-styles

First off — thank you! 💙 Every new style, bug report, and idea makes this library more useful for researchers, students, and writers everywhere. This guide explains exactly how to contribute smoothly — with **zero merge conflicts** and **zero broken pushes**.

## 🎯 Ways to Contribute

| You want to… | Where to go |
|---|---|
| Add a new bibliography style (`.xsl`) | Pull Request — see guide below |
| Ask a question ("How do I install a style?") | [Discussions → Q&A](https://github.com/susovon-jana/word-bibliography-styles/discussions) |
| Suggest a new style or a website feature | [Discussions → Ideas & Requests](https://github.com/susovon-jana/word-bibliography-styles/discussions) |
| Report a bug (site, catalog, workflows) | [Issues](https://github.com/susovon-jana/word-bibliography-styles/issues) |
| Share the paper or thesis you wrote with these styles | [Discussions → Show and tell](https://github.com/susovon-jana/word-bibliography-styles/discussions) |

## 💬 Code of Conduct

Keep conversations kind, inclusive, and on-topic. We're a community of researchers helping researchers — be patient with beginners, credit others' work, and remember that everyone here volunteers their time. 💪

## ⚠️ The Golden Rule: Push with Git — Never Upload via the Web Editor

**Please do not add files using GitHub's drag-and-drop web upload.** Web uploads bypass validation and are the #1 cause of merge conflicts — they can block you *and other contributors* from pushing later.

All file contributions must be committed from a local clone (VS Code or terminal). This keeps the catalog generator able to validate your style, keeps git history clean, and keeps everyone's `git push` working smoothly.

---

## ➕ Adding a New Bibliography Style (Step by Step)

### 1. Fork & Clone

Fork the repository, then clone your fork and open it in VS Code:

```bash
git clone https://github.com/<your-username>/word-bibliography-styles.git
cd word-bibliography-styles
code .
```

### 2. Create a Branch

```bash
git checkout -b add-my-new-style
```

### 3. Add Your Style File

Copy your `.xsl` file into the **`styles/`** folder:

```text
styles/YourNewStyle.xsl
```

### 4. Rebuild & Validate the Catalog Locally

```bash
node scripts/generate-catalog.mjs
```

This regenerates `styles/index.json` and checks that every `.xsl` file in the folder is valid. Fix any errors it reports before committing.

### 5. Commit

```bash
git add styles/YourNewStyle.xsl styles/index.json
git commit -m "Add YourNewStyle bibliography style"
```

Commit message convention: `Add <StyleName> bibliography style` or `Update <StyleName> bibliography style`.

### 6. Push & Open a Pull Request

```bash
git push origin add-my-new-style
```

Then open a PR from your fork to this repository. **Pull Request checklist:**

- [ ] The `.xsl` file is inside `styles/`
- [ ] `styles/index.json` was rebuilt with `node scripts/generate-catalog.mjs`
- [ ] The style opens in Word without errors (if you were able to test)
- [ ] Commit message follows the convention above

Once merged, the deploy workflow runs automatically and your style appears on **[the website](https://susovon-jana.github.io/word-bibliography-styles/)** within seconds. 🎉

---

## 📄 Style File Requirements

For a style to be accepted, it should be:

- **A valid Word bibliography style** — well-formed XML with the `b:Style` root element
- **Nameable in Word** — includes a `b:StyleNameLocalized` element (this is the name users see in Word's style dropdown)
- **Cleanly named** — filename without spaces, using CamelCase or hyphens: `APASeventhEdition.xsl`, `HarvardAnglia.xsl` ✅ · `my new style.xsl` ❌
- **Tested in Word** (recommended) — see below

## 🧪 Testing Your Style Locally in Word

Copy the `.xsl` file to Word's bibliography styles folder, then restart Word and check **References → Style**:

- **Windows:** `%APPDATA%\Microsoft\Bibliography\Style`
- **macOS:** `~/Library/Containers/com.microsoft.Word/Data/Documents/Bibliography/Style`

## 🗂️ Catalog Metadata (Optional)

The catalog generator auto-detects styles, but if your style needs a custom display name, description, or category (author-date / numeric / custom / general), add an entry to **`scripts/catalog-overrides.json`** in the same PR.

---

## 🌐 Improving the Website

The site is plain HTML/CSS/JS with no build step — edits take effect on the next deploy:

| File | Purpose |
|---|---|
| `index.html` | Page structure & sections |
| `assets/app.js` | GitHub API live listing, catalog fallback, search & filters |
| `assets/styles.css` | Design system (glassmorphism, themes, animations) |
| `scripts/generate-catalog.mjs` | Node catalog generator + XSL validator |
| `.github/workflows/` | CI: style validation + GitHub Pages deploy |

To preview locally:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

## 🐛 Reporting a Bug

When opening an issue, please include:

1. What you did and what you expected to happen
2. What actually happened (screenshot if visual)
3. Browser and operating system
4. Any console errors (F12 → Console tab)

## ✅ Review Process

1. CI automatically validates every `.xsl` in your PR
2. A maintainer reviews the style output and naming
3. On merge, the site redeploys and your style goes live within seconds

We aim to review contributions within a few days — thank you for your patience.

## ❓ Questions?

Not sure about anything above? Don't guess — ask in [Discussions → Q&A](https://github.com/susovon-jana/word-bibliography-styles/discussions). No question is too small. 🙂

— **Susovon Jana, Ph.D.** (maintainer) · [🌐 Website](https://dr-susovon.pages.dev/)
