#!/usr/bin/env node
/**
 * generate-catalog.mjs — Word Bibliography Styles catalogue builder + validator.
 *
 * Replaces the old Windows-only PowerShell scripts (Build-StyleCatalog.ps1 /
 * Validate-Styles.ps1). Cross-platform: runs on any OS with Node.js >= 16,
 * locally or inside GitHub Actions.
 *
 * What it does:
 *   1. Scans styles/ for *.xsl files (any case).
 *   2. Validates each file is a Word bibliography XSL (XML stylesheet with the
 *      bibliography namespace) and exits non-zero on failure.
 *   3. Extracts the real Word display name (b:StyleName or the English
 *      b:StyleNameLocalized, e.g. "APA7") directly from each file.
 *   4. Merges optional human metadata from scripts/catalog-overrides.json.
 *   5. Writes styles/index.json — consumed by the website as an offline
 *      fallback. (The site ALSO reads the GitHub Contents API live, so new
 *      files appear even before this catalog is regenerated.)
 *
 * Usage:  node scripts/generate-catalog.mjs [--styles-dir <path>]
 */

import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ---------- configuration ---------- */
const argIndex = process.argv.indexOf("--styles-dir");
const stylesDir = resolve(
  argIndex > -1 ? process.argv[argIndex + 1] : join(__dirname, "..", "styles")
);
const overridesPath = join(__dirname, "catalog-overrides.json");
const catalogPath = join(stylesDir, "index.json");

const CATEGORY_LABELS = {
  "author-date": "Author–date",
  numeric: "Numeric",
  custom: "Custom",
  general: "General",
};

/* ---------- helpers ---------- */
function humanizeFilename(file) {
  let base = file.replace(/\.(xsl)$/i, "");
  base = base
    .replace(/OfficeOnline/gi, "")
    .replace(/Nmerical/g, " Numerical")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return base || file;
}

function guessCategory(file) {
  const f = file.toLowerCase();
  if (/(^|[^a-z])doi([^a-z]|$)/.test(f)) return "custom";
  if (/apa|harvard|mla|chicago|turabian|sist/.test(f)) return "author-date";
  if (/ieee|iso690|iso ?690|gb|gost|turabian|numeric/.test(f)) return "numeric";
  return "general";
}

/** Pull metadata out of the XSL source with tolerant regexes. */
function parseXslMetadata(xml) {
  const first = (...patterns) => {
    for (const re of patterns) {
      const m = xml.match(re);
      if (m && m[1]) return m[1].trim().replace(/\s+/g, " ");
    }
    return null;
  };

  const styleName = first(
    /<xsl:when[^>]*test=["']b:StyleName["'][^>]*>\s*(?:<xsl:text>\s*)?([^<]+?)(?:\s*<\/xsl:text>)?\s*<\/xsl:when>/,
    /<b:StyleName[^>]*>([^<]+)<\/b:StyleName>/
  );

  const localizedName = first(
    /b:Lcid=["']1033["'][^>]*>\s*(?:<xsl:text>\s*)?([^<]+?)(?:\s*<\/xsl:text>)/,
    /b:Lcid=["']1033["'][^>]*>\s*<xsl:when[^>]*>\s*(?:<xsl:text>\s*)?([^<]+?)(?:\s*<\/xsl:text>)/
  );

  const citationType = first(
    /<xsl:when[^>]*test=["']b:CitationType["'][^>]*>\s*(?:<xsl:text>\s*)?([^<]+?)(?:\s*<\/xsl:text>)?\s*<\/xsl:when>/,
    /<b:CitationType[^>]*>([^<]+)<\/b:CitationType>/
  );

  const version = first(
    /<xsl:when[^>]*test=["']b:XslVersion["'][^>]*>\s*(?:<xsl:text>\s*)?([^<]+?)(?:\s*<\/xsl:text>)?\s*<\/xsl:when>/,
    /<b:Version[^>]*>([^<]+)<\/b:Version>/
  );

  return { styleName, localizedName, citationType, version };
}

function validateXsl(file, xml) {
  const problems = [];
  if (!xml || xml.length < 64) problems.push("file is empty or too small");
  if (!/<xsl:stylesheet/i.test(xml))
    problems.push("missing <xsl:stylesheet> root element");
  if (!/schemas\.openxmlformats\.org\/officeDocument\/2006\/bibliography/i.test(xml))
    problems.push("missing Word bibliography namespace");
  return problems;
}

/* ---------- main ---------- */
function main() {
  let files;
  try {
    files = readdirSync(stylesDir).filter((f) => /\.xsl$/i.test(f));
  } catch (error) {
    console.error(`✖ Cannot read styles directory: ${stylesDir}\n  ${error.message}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error(`✖ No .xsl files found in ${stylesDir}`);
    process.exit(1);
  }

  let overrides = {};
  try {
    const raw = JSON.parse(readFileSync(overridesPath, "utf8"));
    for (const [key, value] of Object.entries(raw)) {
      if (!key.startsWith("_")) overrides[key] = value;
    }
  } catch {
    console.warn("⚠ catalog-overrides.json missing or invalid — using auto metadata only.");
  }

  let failures = 0;
  const styles = [];

  for (const file of files.sort((a, b) => a.localeCompare(b, "en"))) {
    const filePath = join(stylesDir, file);
    const xml = readFileSync(filePath, "utf8");

    const problems = validateXsl(file, xml);
    if (problems.length) {
      console.error(`✖ ${file}: ${problems.join("; ")}`);
      failures += 1;
      continue;
    }

    const parsed = parseXslMetadata(xml);
    const ov = overrides[file] || {};
    const human = humanizeFilename(file);
    const size = statSync(filePath).size;

    const displayName = ov.name || parsed.styleName || parsed.localizedName || human;
    const wordName =
      ov.wordName || parsed.localizedName || parsed.styleName || displayName;
    const category = ov.category || guessCategory(file);

    styles.push({
      file,
      name: displayName,
      wordName,
      category,
      categoryLabel: ov.categoryLabel || CATEGORY_LABELS[category] || CATEGORY_LABELS.general,
      summary:
        ov.summary ||
        `Microsoft Word bibliography style: ${displayName}. Download and install it in the Word bibliography styles folder.`,
      features: ov.features || [
        "Compatible with Microsoft Word bibliography tools",
        "Downloadable XSL style file",
        "Installable in the Word styles folder",
      ],
      size,
    });

    console.log(
      `✔ ${file} → "${displayName}" (Word name: "${wordName}", ${category}, ${(size / 1024).toFixed(0)} KB)`
    );
  }

  if (failures > 0) {
    console.error(`\n✖ Validation failed for ${failures} file(s). Catalog not written.`);
    process.exit(1);
  }

  const catalog = {
    generated: new Date().toISOString(),
    generator: "scripts/generate-catalog.mjs",
    count: styles.length,
    styles,
  };

  writeFileSync(catalogPath, JSON.stringify(catalog, null, 2) + "\n", "utf8");
  console.log(
    `\n★ Wrote ${catalogPath} with ${styles.length} style(s), generated ${catalog.generated}`
  );
}

main();
