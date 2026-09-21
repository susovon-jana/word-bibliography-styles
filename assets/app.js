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
  dialogContent.innerHTML = `<p class="eyebrow">${escapeHtml(style.categoryLabel)}</p><h2>${escapeHtml(style.name)}</h2><p>${escapeHtml(style.summary)}</p><p class="dialog-file">${escapeHtml(style.file)}</p><h3>Features</h3><ul class="dialog-features">${style.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul><h3>Use in Word</h3><p>Download this file, copy it to <code>%APPDATA%\\Microsoft\\Bibliography\\Style</code>, restart Word, then select <strong>${escapeHtml(style.wordName)}</strong> under References → Style.</p><a class="button" href="styles/${encodeURIComponent(style.file)}" download="${escapeHtml(style.file)}">Download ${escapeHtml(style.file)} <span aria-hidden="true">↓</span></a>`;
  dialog.showModal();
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
document.querySelector("#copy-path").addEventListener("click", async (event) => { await navigator.clipboard.writeText("%APPDATA%\\Microsoft\\Bibliography\\Style"); event.currentTarget.textContent = "Copied"; setTimeout(() => { event.currentTarget.textContent = "Copy path"; }, 1600); });
loadCatalogue();
