[CmdletBinding()]
param(
    [string]$StylesPath = (Join-Path $PSScriptRoot '..\styles')
)

$catalogPath = Join-Path $StylesPath 'index.json'
$customMetadata = @{
    'IEEE_with_DOI.xsl' = @{ Name = 'IEEE with DOI'; WordName = 'IEEE with DOI'; Category = 'custom'; CategoryLabel = 'Custom'; Summary = 'Modern IEEE numerical references with clickable DOI and website links.'; Features = @('Clickable DOI identifiers and doi.org links', 'Website fallback when no DOI is available', 'Numeric in-text citations and bibliography order') }
    'IEEE2006OfficeOnline.xsl' = @{ Name = 'IEEE'; WordName = 'IEEE'; Category = 'numeric'; CategoryLabel = 'Numeric'; Summary = 'The standard Word IEEE numeric citation style.'; Features = @('Bracketed numeric citations', 'References ordered by citation number', 'Supports books, articles, websites, and reports') }
    'APASixthEditionOfficeOnline.xsl' = @{ Name = 'APA Sixth Edition'; WordName = 'APA Sixth Edition'; Category = 'author-date'; CategoryLabel = 'Author–date'; Summary = 'APA 6th edition references for social and behavioral sciences.'; Features = @('Author and year citations', 'Alphabetical reference list', 'Publication and source details') }
    'CHICAGO.XSL' = @{ Name = 'Chicago'; WordName = 'Chicago'; Category = 'author-date'; CategoryLabel = 'Author–date'; Summary = 'Chicago author-date references for academic writing.'; Features = @('Author-date citation format', 'Alphabetical bibliography', 'Books, journals, and web sources') }
    'HarvardAnglia2008OfficeOnline.xsl' = @{ Name = 'Harvard Anglia'; WordName = 'Harvard - Anglia'; Category = 'author-date'; CategoryLabel = 'Author–date'; Summary = 'Harvard Anglia references with author-date citations.'; Features = @('Author-date citation format', 'Alphabetical bibliography', 'Readable publication details') }
    'MLASeventhEditionOfficeOnline.xsl' = @{ Name = 'MLA Seventh Edition'; WordName = 'MLA Seventh Edition'; Category = 'author-date'; CategoryLabel = 'Author–date'; Summary = 'MLA 7th edition works cited formatting.'; Features = @('Author-led citations', 'Works Cited output', 'Humanities-focused reference rules') }
}

$styles = foreach ($styleFile in Get-ChildItem -LiteralPath $StylesPath -Filter '*.xsl' -File | Sort-Object Name) {
    $metadata = $customMetadata[$styleFile.Name]
    if (-not $metadata) {
        $displayName = [System.IO.Path]::GetFileNameWithoutExtension($styleFile.Name).Replace('OfficeOnline', '').Replace('Nmerical', ' Numerical')
        $metadata = @{ Name = $displayName; WordName = $displayName; Category = 'numeric'; CategoryLabel = 'Reference style'; Summary = "Microsoft Word bibliography style: $displayName."; Features = @('Compatible with Microsoft Word bibliography tools', 'Downloadable XSL style file', 'Installable in the Word styles folder') }
    }
    [pscustomobject]@{ file = $styleFile.Name; name = $metadata.Name; wordName = $metadata.WordName; category = $metadata.Category; categoryLabel = $metadata.CategoryLabel; summary = $metadata.Summary; features = $metadata.Features }
}

$styles | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $catalogPath -Encoding utf8
Write-Host "Updated $catalogPath with $($styles.Count) styles."
