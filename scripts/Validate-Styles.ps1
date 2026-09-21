[CmdletBinding()]
param(
    [string]$StylesPath = (Join-Path $PSScriptRoot '..\styles')
)

$styleFiles = Get-ChildItem -LiteralPath $StylesPath -Filter '*.xsl' -File

if ($styleFiles.Count -eq 0) {
    throw "No XSL files were found in $StylesPath."
}

foreach ($styleFile in $styleFiles) {
    try {
        $null = [xml](Get-Content -LiteralPath $styleFile.FullName -Raw)
        Write-Host "Valid XML: $($styleFile.Name)"
    }
    catch {
        throw "Invalid XML in $($styleFile.FullName): $($_.Exception.Message)"
    }
}
