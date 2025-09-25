const form = document.getElementById("contractor-form");
const statusText = document.getElementById("form-status");
const previewContainer = document.getElementById("contractors-preview");
const countHint = document.getElementById("contractor-count");
const exportButton = document.getElementById("export-contractors");
const STORAGE_KEY = "contractorsData";
let contractors = [];
function loadContractors() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      contractors = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to parse contractors data", error);
  }
  renderPreview();
}
function saveContractors() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contractors));
}
function renderPreview() {
  countHint.textContent = `כמות קבלנים ברשימה: ${contractors.length.toLocaleString()}`;
  if (!contractors.length) {
    previewContainer.innerHTML =
      '<p class="hint">הרשימה ריקה. הוסף קבלן חדש כדי להתחיל.</p>';
    return;
  }
  const fragment = document.createDocumentFragment();
  const latest = contractors.slice(-5).reverse();
  latest.forEach((contractor, index) => {
    const card = document.createElement("article");
    card.className = "result-card";
    const title = document.createElement("h3");
    title.textContent = `רישום אחרון #${contractors.length - index}`;
    card.appendChild(title);
    const list = document.createElement("dl");
    Object.entries(contractor).forEach(([key, value]) => {
      const dt = document.createElement("dt");
      dt.textContent = key;
      const dd = document.createElement("dd");
      dd.textContent = value || "-";
      list.append(dt, dd);
    });
    card.appendChild(list);
    fragment.appendChild(card);
  });
  previewContainer.innerHTML = "";
  previewContainer.appendChild(fragment);
}
function resetStatus() {
  statusText.textContent = "";
  statusText.classList.remove("error");
}
function handleSubmit(event) {
  event.preventDefault();
  resetStatus();
  const formData = new FormData(form);
  const newContractor = {
    "שם מלא": formData.get("fullName"),
    "מספר זיהוי": formData.get("identifier"),
    "שם חברה": formData.get("company"),
    "טלפון": formData.get("phone"),
    "דוא"ל": formData.get("email"),
    "תוקף אישור": formData.get("approvalUntil"),
    "הערות": formData.get("notes"),
    "תאריך הזנה": new Date().toLocaleDateString("he-IL"),
  };
  if (!newContractor["שם מלא"] || !newContractor["מספר זיהוי"]) {
    statusText.textContent = "אנא מלא את כל השדות החיוניים.";
    statusText.classList.add("error");
    return;
  }
  contractors.push(newContractor);
  saveContractors();
  renderPreview();
  form.reset();
  statusText.textContent = "הקבלן נוסף בהצלחה לרשימה המקומית.";
}
function exportContractors() {
  if (!contractors.length) {
    alert("אין נתונים לייצוא. הוסף קבלן או טען קובץ קיים.");
    return;
  }
  const worksheet = XLSX.utils.json_to_sheet(contractors);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "קבלנים");
  XLSX.writeFile(workbook, "contractors-updated.xlsx");
}
form.addEventListener("submit", handleSubmit);
exportButton.addEventListener("click", exportContractors);
document.addEventListener("DOMContentLoaded", loadContractors);