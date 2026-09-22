# Word Bibliography Styles

Ready-to-install Microsoft Word bibliography (citation) styles with a **fully
automatic download site**. The website reads the `styles/` folder on its own —
whenever you push a new `.xsl` file, it appears on the site with no manual
edits.

**Live site:** https://susovon-jana.github.io/word-bibliography-styles/

## How the automatic update works

The site never relies on a hand-written list. Three layers keep it in sync:

| Layer | What it does | When it updates |
| --- | --- | --- |
| 1. GitHub API (live) | `assets/app.js` lists `styles/` directly from the GitHub Contents API on every page load | Instantly, on the next visit after you push |
| 2. Build-time catalog | `scripts/generate-catalog.mjs` re-scans `styles/`, validates every file, and rewrites `styles/index.json` inside the deploy workflow | Every push to `main` |
| 3. Client-side parse | Any file the catalog has never seen gets its real Word name parsed in the browser from the XSL itself (`b:StyleName` / `b:StyleNameLocalized`) | Automatically, on page load |

So the only thing you ever do to publish a new style is:

1. Copy your `.xsl` file into the `styles/` folder.
2. Commit and push to `main`.

That's it. The counter ("Ready for Word … downloadable styles"), the category
filters, the cards and the download links all update themselves.

## Add a style (step by step)

1. Go to the repository on GitHub → `styles/` folder → **Add file → Upload files**.
2. Drop your `.xsl` file in, write a commit message, and press **Commit changes**.
3. Wait about a minute for the *Deploy to GitHub Pages* action to finish, then refresh the site.
4. Even before the action finishes, a hard refresh of the page will usually show the file already, because it is read live from the GitHub API.

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
