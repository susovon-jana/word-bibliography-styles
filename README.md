# Word Bibliography Styles

Ready-to-install Microsoft Word bibliography (citation) styles with a **fully
automatic download site**, curated by **Susovon Jana, Ph.D.**
([profile](https://dr-susovon.pages.dev/)). The website reads the `styles/`
folder on its own — whenever a verified `.xsl` file is pushed, it appears on
the site with no manual edits. Every download button saves the file directly
to the visitor's device (in-browser blob download), so nobody lands on a raw
XML page.

Pair it with [**CitePilot**](https://citepilot.pages.dev/) — the author's free
companion toolkit for generating citations by DOI or title, checking citation
consistency, flagging retracted articles, and exporting references to Word
Bibliography XML, CSL JSON, BibTeX and more.

**Live site:** https://susovon-jana.github.io/word-bibliography-styles/

## How the automatic update works

The site never relies on a hand-written list. Three layers keep it in sync:

| Layer | What it does | When it updates |
| --- | --- | --- |
| 1. GitHub API (live) | `assets/app.js` lists `styles/` directly from the GitHub Contents API on every page load | Instantly, on the next visit after you push |
| 2. Build-time catalog | `scripts/generate-catalog.mjs` re-scans `styles/`, validates every file, and rewrites `styles/index.json` inside the deploy workflow | Every push to `main` |
| 3. Client-side parse | Any file the catalog has never seen gets its real Word name parsed in the browser from the XSL itself (`b:StyleName` / `b:StyleNameLocalized`) | Automatically, on page load |

So the only thing required to publish a new style is a verified,
maintainer-pushed commit to `styles/` — the counter ("Ready for Word …
downloadable styles"), the category filters, the cards and the download links
all update themselves.

## Contributing

This library is **curated for accuracy**. Citation files can silently corrupt a
manuscript, so unverified files are not accepted directly into `styles/`.

Please **do not** use drag-and-drop upload on GitHub (the "Add file" page) — it
bypasses review and can create pull/merge conflicts that block future pushes.

Instead:

1. **Propose** — open a thread in [Discussions](https://github.com/susovon-jana/word-bibliography-styles/discussions)
   with the style file (attached or linked), its source/origin, and why it is needed.
2. **Verify** — the maintainer tests the file in Word and checks reference
   formatting and citation accuracy against the style's official specification.
3. **Publish** — approved files are committed from VS Code (a clean git workflow)
   to `main`, validated by CI, and appear on the site automatically.


Project maintained by Susovon Jana, Ph.D., for all current and future releases.

```bash
git pull origin main              # start from the latest state
git add styles/MyNewStyle.xsl
git commit -m "Add MyNewStyle"
git push origin main              # site updates automatically
```

### Naming and metadata

* The **display name** on the website is taken from inside the file
  (`b:StyleNameLocalized`, English) when available, otherwise from the filename.
* The **name Word shows** (References → Style) is also read from the file and
  shown on each card's *Details* dialog, so you always know what to look for in Word.
* Want a nicer summary or a custom category? Add an entry to
  `scripts/catalog-overrides.json` keyed by the exact filename:

```json
{
  "MyNewStyle.xsl": {
    "name": "My New Style",
    "category": "author-date",
    "summary": "One-line description shown on the card.",
    "features": ["Feature one", "Feature two", "Feature three"]
  }
}
```

Allowed categories: `author-date`, `numeric`, `custom`, `general`.

## Included styles

| Style file | Word menu name | Category |
| --- | --- | --- |
| `APASeventhEdition.xsl` | APA7 | Author–date |
| `APASixthEditionOfficeOnline.xsl` | APA | Author–date |
| `CHICAGO.XSL` | Chicago | Author–date |
| `GB.XSL` | GB7714 | Numeric |
| `GostName.XSL` | GOST - Name Sort | Numeric |
| `GostTitle.XSL` | GOST - Title Sort | Numeric |
| `HarvardAnglia2008OfficeOnline.xsl` | Harvard - Anglia | Author–date |
| `IEEE2006OfficeOnline.xsl` | IEEE | Numeric |
| `IEEE_with_DOI.xsl` | IEEE with DOI | Custom |
| `ISO690.XSL` | ISO 690 - First Element and Date | Numeric |
| `ISO690Nmerical.XSL` | ISO 690 - Numerical Reference | Numeric |
| `MLASeventhEditionOfficeOnline.xsl` | MLA | Author–date |
| `SIST02.XSL` | SIST02 | Author–date |
| `TURABIAN.XSL` | Turabian | Numeric |

### IEEE with DOI behavior

The custom IEEE with DOI style uses the following priority:

1. A DOI stored in the source **DOI** field, shown as `doi: 10.xxxx/...` with a clickable link.
2. A full DOI resolver URL, displayed as `https://doi.org/...` without a duplicate label.
3. A normal website URL when no DOI is present, displayed as `Available: https://...`.

If Word does not provide a DOI field in its source dialog, put either
`10.xxxx/...` or `DOI: 10.xxxx/...` in **Comments**, or put the resolver URL in **URL**.

## Install in Word

**Windows**

1. Close all Microsoft Word windows.
2. Press <kbd>Win</kbd>+<kbd>R</kbd>, enter `%APPDATA%\Microsoft\Bibliography\Style`, press <kbd>Enter</kbd>.
3. Copy the downloaded `.xsl` files into that folder.
4. Reopen Word → **References** → **Style** → pick the new style.
5. Select the bibliography and click **Update Citations and Bibliography**.

**macOS**

1. Quit Word.
2. Copy the `.xsl` files to `~/Library/Containers/com.microsoft.Word/Data/Documents/Bibliography/Style`
   (create the folder if it does not exist).
3. Reopen Word → **References** → **Style**.

## Local development

Any static file server works:

```bash
# Python
python -m http.server 8080

# or Node
npx serve .
```

Then open http://localhost:8080.

To rebuild the catalog manually (the GitHub Action does this automatically):

```bash
node scripts/generate-catalog.mjs
```

Requirements: Node.js 16+ (any operating system). The old PowerShell scripts
(`Build-StyleCatalog.ps1`, `Validate-Styles.ps1`) have been removed — the Node
script replaces both and runs everywhere, including the GitHub Actions
`ubuntu-latest` runner.

## Repository layout

```
├── index.html                  # the site
├── assets/
│   ├── app.js                  # 3-layer auto-update loader + UI logic
│   ├── styles.css              # design system (light/dark)
│   └── favicon.svg
├── styles/                     # ← drop new .xsl files here
│   └── index.json              # generated catalog (do not edit by hand)
├── scripts/
│   ├── generate-catalog.mjs    # validator + catalog builder (Node)
│   └── catalog-overrides.json  # optional per-style metadata
└── .github/workflows/
    ├── deploy-pages.yml        # validate → rebuild catalog → deploy
    └── validate-styles.yml     # validate on every push/PR
```
