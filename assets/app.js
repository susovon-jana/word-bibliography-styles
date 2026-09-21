const catalogueUrl = "styles/index.json";
const grid = document.querySelector("#style-grid");
const search = document.querySelector("#style-search");
const filters = document.querySelectorAll(".filter");
const dialog = document.querySelector("#style-dialog");
const dialogContent = document.querySelector("#dialog-content");
const cardTemplate = document.querySelector("#style-card-template");
let styles = [];
let activeFilter = "all";

const escapeHtml = (value) => value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);

function renderStyles() {
  const term = search.value.trim().toLowerCase();
  const visibleStyles = styles.filter((style) => {
    const matchesFilter = activeFilter === "all" || style.category === activeFilter;
    const searchable = `${style.name} ${style.summary} ${style.features.join(" ")}`.toLowerCase();
    return matchesFilter && searchable.includes(term);
  });
  grid.replaceChildren();
  if (!visibleStyles.length) {
    grid.innerHTML = '<p class="loading">No styles match that search. Try a different name or category.</p>';
    return;
  }
  visibleStyles.forEach((style, index) => {
    const card = cardTemplate.content.cloneNode(true);
    const article = card.querySelector("article");
    article.style.animationDelay = `${Math.min(index * 45, 320)}ms`;
    card.querySelector(".style-category").textContent = style.categoryLabel;
    card.querySelector("h3").textContent = style.name;
    card.querySelector(".style-summary").textContent = style.summary;
    card.querySelector(".feature-list").replaceChildren(...style.features.slice(0, 3).map((feature) => { const item = document.createElement("li"); item.textContent = feature; return item; }));
    const download = card.querySelector(".download-button");
    download.href = `styles/${encodeURIComponent(style.file)}`;
    download.setAttribute("download", style.file);
    card.querySelector(".details-button").addEventListener("click", () => showDetails(style));
    grid.append(card);
  });
}

function showDetails(style) {
  const examples = citationExamples(style);
  dialogContent.innerHTML = `<p class="eyebrow">${escapeHtml(style.categoryLabel)}</p><h2>${escapeHtml(style.name)}</h2><p>${escapeHtml(style.summary)}</p><p class="dialog-file">${escapeHtml(style.file)}</p><h3>Features</h3><ul class="dialog-features">${style.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul><h3>Citation examples</h3><div class="example-panel"><p><strong>Parenthetical:</strong> ${escapeHtml(examples.parenthetical)}</p><p><strong>Narrative:</strong> ${escapeHtml(examples.narrative)}</p></div><h3>Reference examples</h3><ol class="reference-examples">${examples.references}</ol><h3>Use in Word</h3><p>Download this file, then copy it to <button class="copyable-path" type="button" data-copy-path="%APPDATA%\\Microsoft\\Bibliography\\Style" title="Copy Word styles folder">%APPDATA%\\Microsoft\\Bibliography\\Style</button>. Restart Word, then select <strong>${escapeHtml(style.wordName)}</strong> under References → Style.</p><a class="button" href="styles/${encodeURIComponent(style.file)}" download="${escapeHtml(style.file)}">Download ${escapeHtml(style.file)} <span aria-hidden="true">↓</span></a>`;
  dialogContent.querySelector(".copyable-path").addEventListener("click", copyStylesPath);
  dialog.showModal();
}

function citationExamples(style) {
  const doiOne = '<a href="https://doi.org/10.1108/ijoem-05-2023-0698" target="_blank" rel="noreferrer">10.1108/ijoem-05-2023-0698</a>';
  const doiTwo = '<a href="https://doi.org/10.1080/02102412.2026.2647688" target="_blank" rel="noreferrer">10.1080/02102412.2026.2647688</a>';
  const doiUrlOne = '<a href="https://doi.org/10.1108/ijoem-05-2023-0698" target="_blank" rel="noreferrer">https://doi.org/10.1108/ijoem-05-2023-0698</a>';
  const doiUrlTwo = '<a href="https://doi.org/10.1080/02102412.2026.2647688" target="_blank" rel="noreferrer">https://doi.org/10.1080/02102412.2026.2647688</a>';
  if (style.file === "MLASeventhEditionOfficeOnline.xsl") return { parenthetical: "(Jana and Sahu)", narrative: "Jana and Sahu argue that cryptocurrency behaviour can be studied through wavelet analysis.", references: `<li>Jana, S., and T. N. Sahu. “A Wavelet Analysis of Investing in Cryptocurrencies in the Indian Stock Market.” <em>International Journal of Emerging Markets</em>, vol. 20, no. 8, 2025, pp. 3229–3251. ${doiOne}.</li><li>Jana, S., et al. “Dynamic Connectedness Between Modern Investment Assets and Equity Markets: Portfolio Hedging Strategies.” <em>Spanish Journal of Finance and Accounting</em>, 2026, pp. 1–26. ${doiTwo}.</li>` };
  if (style.category === "author-date") return { parenthetical: "(Jana & Sahu, 2025; Jana et al., 2026)", narrative: "Jana and Sahu (2025)", references: `<li>Jana, S., &amp; Sahu, T. N. (2025). A wavelet analysis of investing in cryptocurrencies in the Indian stock market. <em>International Journal of Emerging Markets, 20</em>(8), 3229–3251. ${doiUrlOne}</li><li>Jana, S., Datta, S., Nandi, A., Agarwala, N., Mondal, S., &amp; Sahu, T. N. (2026). Dynamic connectedness between modern investment assets and equity markets: Portfolio hedging strategies. <em>Spanish Journal of Finance and Accounting</em>, 1–26. ${doiUrlTwo}</li>` };
  return { parenthetical: "[1], [2]", narrative: "Jana and Sahu [1]", references: `<li>S. Jana and T. N. Sahu, “A Wavelet Analysis of Investing in Cryptocurrencies in the Indian Stock Market,” <em>International Journal of Emerging Markets</em>, vol. 20, no. 8, pp. 3229–3251, 2025, doi: ${doiOne}.</li><li>S. Jana, S. Datta, A. Nandi, N. Agarwala, S. Mondal, and T. N. Sahu, “Dynamic Connectedness Between Modern Investment Assets and Equity Markets: Portfolio Hedging Strategies,” <em>Spanish Journal of Finance and Accounting</em>, pp. 1–26, 2026, doi: ${doiTwo}.</li>` };
}

async function loadCatalogue() {
  try {
    const response = await fetch(catalogueUrl);
    if (!response.ok) throw new Error("Catalogue unavailable");
    styles = await response.json();
    document.querySelector("#style-total").textContent = styles.length;
    renderStyles();
  } catch (error) {
    grid.innerHTML = '<p class="loading">The style catalogue could not load. Please refresh the page or open this site through GitHub Pages.</p>';
  }
}

search.addEventListener("input", renderStyles);
filters.forEach((filter) => filter.addEventListener("click", () => { activeFilter = filter.dataset.filter; filters.forEach((item) => item.classList.toggle("active", item === filter)); renderStyles(); }));
document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
async function copyStylesPath(event) {
  const button = event.currentTarget;
  await navigator.clipboard.writeText(button.dataset.copyPath || "%APPDATA%\\Microsoft\\Bibliography\\Style");
  const originalText = button.textContent;
  button.textContent = "Copied";
  setTimeout(() => { button.textContent = originalText; }, 1600);
}

document.querySelector("#copy-path").addEventListener("click", copyStylesPath);
document.querySelectorAll(".copyable-path").forEach((button) => button.addEventListener("click", copyStylesPath));
loadCatalogue();
