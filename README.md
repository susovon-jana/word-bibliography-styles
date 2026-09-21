# Word Bibliography Styles

Word-compatible bibliography styles for Microsoft Office. The custom **IEEE with DOI** style adds DOI and website links to the standard IEEE reference output.

## Included styles

| Style file | Word menu name |
| --- | --- |
| `IEEE_with_DOI.xsl` | IEEE with DOI |
| `IEEE2006OfficeOnline.xsl` | IEEE |
| `APASixthEditionOfficeOnline.xsl` | APA Sixth Edition |
| `CHICAGO.XSL` | Chicago |
| `GB.XSL` | GB/T 7714 |
| `GostName.XSL`, `GostTitle.XSL` | GOST |
| `HarvardAnglia2008OfficeOnline.xsl` | Harvard Anglia |
| `ISO690.XSL`, `ISO690Nmerical.XSL` | ISO 690 |
| `MLASeventhEditionOfficeOnline.xsl` | MLA Seventh Edition |
| `SIST02.XSL` | SIST 02 |
| `TURABIAN.XSL` | Turabian |

`APASeventhEdition.xsl` and `EmeraldHarvard.xsl` are not included in this archive because they were only available in the protected per-user Office folder. Copy those two files into `styles/` before publishing if you own the right to distribute them.

## Install in Word for Windows

1. Close all Microsoft Word windows.
2. Extract this repository, then open the `styles` folder.
3. Press <kbd>Win</kbd>+<kbd>R</kbd>, enter `%APPDATA%\Microsoft\Bibliography\Style`, and press <kbd>Enter</kbd>.
4. Copy the required `.xsl` files into that folder. Do not replace a built-in style unless you intend to customize it.
5. Reopen Word, select **References** → **Style**, and choose the style, for example **IEEE with DOI**.
6. Select the bibliography and use **Update Citations and Bibliography** after changing a source.

### IEEE with DOI behavior

The style uses the following priority:

1. A DOI stored in the source `DOI` field, as `doi: 10.xxxx/...` with a clickable link.
2. A full DOI resolver URL, displayed as `https://doi.org/...` without a duplicate `doi:` label.
3. A normal website URL when no DOI is present, displayed as `Available: https://...`.

If Word does not provide a DOI field in its source dialog, put either `10.xxxx/...` or `DOI: 10.xxxx/...` in **Comments**, or put the resolver URL in **URL**.

## Work with VS Code

1. Extract the zip and open the `word-bibliography-styles` folder in VS Code.
2. Install the **XML** and **PowerShell** extensions from the VS Code Extensions view.
3. Edit files in `styles/` only. XSL is XML; preserve namespaces, element nesting, and UTF-8 encoding.
4. In the integrated PowerShell terminal, run:

   ```powershell
   .\scripts\Validate-Styles.ps1
   ```

5. Test a changed style in Word using a document that has at least one source for every affected reference type.

## Publish to GitHub

Create an empty GitHub repository, then run these commands from the VS Code terminal. Replace `YOUR-ACCOUNT` with your GitHub username and `YOUR-REPOSITORY` with the repository name.

```powershell
git init
git add .
git commit -m "Add Word bibliography styles"
git branch -M main
git remote add origin https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
git push -u origin main
```

## For Update in the GitHub

```powershell
git add .
git commit -m "Update bibliography styles"
git push
```

The included GitHub Actions workflow validates every XSL file when you push or open a pull request.

## Publish the download website

This repository includes a responsive download website at `index.html`. It loads its style cards from `styles/index.json`; the deployment workflow rebuilds this catalogue every time you push to `main`.

1. Push the repository to GitHub using the commands above.
2. On GitHub, open **Settings** → **Pages**.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push a commit to `main` or run **Deploy documentation site** from the **Actions** tab.
5. GitHub displays the public website address when the workflow completes.

To add a new style later, add its `.xsl` file to `styles/`, run `./scripts/Validate-Styles.ps1` locally, and push the change. The style is automatically added to the website download catalogue during deployment.

## License and attribution

Several files are Microsoft Office-provided styles. Review the applicable Microsoft Office license before publishing or relicensing them. Do not apply an open-source license to those upstream files unless you have permission. Document your own changes to `IEEE_with_DOI.xsl` in commits or release notes.
