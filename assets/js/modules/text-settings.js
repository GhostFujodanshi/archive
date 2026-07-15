// Pengaturan tampilan teks chapter: font & ukuran huruf.
// Preferensi disimpan di localStorage supaya diingat tiap kali baca lagi.

const FONT_OPTIONS = [
    { id: "sans", label: "Sans", stack: "'Poppins', sans-serif" },
    { id: "serif", label: "Serif", stack: "'Merriweather', serif" },
    { id: "klasik", label: "Klasik", stack: "'Lora', serif" },
    { id: "santai", label: "Santai", stack: "'Nunito', sans-serif" },
    { id: "elegan", label: "Elegan", stack: "'Playfair Display', serif" },
];

const MIN_SIZE = 12;
const MAX_SIZE = 32;
const DEFAULT_SIZE = 16;

function getSavedFont() {
    const saved = localStorage.getItem("gf-reader-font");
    return FONT_OPTIONS.find((f) => f.id === saved) || FONT_OPTIONS[0];
}

function getSavedSize() {
    const saved = Number(localStorage.getItem("gf-reader-size"));
    return saved >= MIN_SIZE && saved <= MAX_SIZE ? saved : DEFAULT_SIZE;
}

function applyFont(font) {
    document.documentElement.style.setProperty("--reader-font-family", font.stack);
}

function applySize(size) {
    document.documentElement.style.setProperty("--reader-font-size", `${size}px`);
}

// dipanggil sepagi mungkin (sebelum isi chapter dirender) supaya
// tidak ada "flash" ukuran/font default sebelum preferensi diterapkan
export function applySavedTextSettings() {
    applyFont(getSavedFont());
    applySize(getSavedSize());
}

export function initTextSettingsPanel() {
    const toggleBtn = document.getElementById("text-settings-toggle");
    const panel = document.getElementById("text-settings-panel");
    if (!toggleBtn || !panel) return;

    let currentFont = getSavedFont();
    let currentSize = getSavedSize();

    panel.innerHTML = `
        <div class="text-settings-panel__group">
            <span class="text-settings-panel__label">Jenis Huruf</span>
            <div class="font-family-options">
                ${FONT_OPTIONS.map(
                    (f) => `
                    <button
                        data-font="${f.id}"
                        class="${f.id === currentFont.id ? "is-active" : ""}"
                        style="font-family:${f.stack}">
                        ${f.label}
                    </button>`
                ).join("")}
            </div>
        </div>
        <div class="text-settings-panel__group">
            <span class="text-settings-panel__label">
                Ukuran Huruf — <span id="font-size-label">${currentSize}px</span>
            </span>
            <input
                type="range"
                id="font-size-slider"
                min="${MIN_SIZE}"
                max="${MAX_SIZE}"
                step="1"
                value="${currentSize}"
                aria-label="Ukuran huruf">
        </div>
    `;

    toggleBtn.addEventListener("click", () => {
        const isOpen = panel.hidden === false;
        panel.hidden = isOpen;
        toggleBtn.classList.toggle("is-active", !isOpen);
    });

    panel.querySelectorAll("[data-font]").forEach((btn) => {
        btn.addEventListener("click", () => {
            currentFont = FONT_OPTIONS.find((f) => f.id === btn.dataset.font);
            applyFont(currentFont);
            localStorage.setItem("gf-reader-font", currentFont.id);

            panel.querySelectorAll("[data-font]").forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");
        });
    });

    const sizeLabel = document.getElementById("font-size-label");
    const sizeSlider = document.getElementById("font-size-slider");

    sizeSlider.addEventListener("input", () => {
        currentSize = Number(sizeSlider.value);
        applySize(currentSize);
        localStorage.setItem("gf-reader-size", currentSize);
        sizeLabel.textContent = `${currentSize}px`;
    });
}
