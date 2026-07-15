import { loadComponents } from "../component-loader.js";
import { getJSON, getText } from "../modules/api.js";
import { render } from "../modules/render.js";
import { createAutoScroller } from "../modules/auto-scroll.js";
import { applySavedTextSettings, initTextSettingsPanel } from "../modules/text-settings.js";

// diterapkan sesegera mungkin (sebelum konten chapter dirender)
// supaya tidak ada flash ukuran/font default
applySavedTextSettings();

function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        slug: params.get("slug"),
        chapter: Number(params.get("chapter")) || 1,
    };
}

async function renderChapter(novel, chapterTitles, chapterNumber) {
    const title = chapterTitles[chapterNumber - 1];

    if (!novel || !title) {
        render("chapter-content", `<p>Chapter tidak ditemukan.</p>`);
        return;
    }

    document.title = `${novel.title} - Chapter ${chapterNumber} - Ghost Fujodanshi Scanlation`;

    render("chapter-header", `
        <a href="novel.html?slug=${novel.slug}" class="chapter-back">← ${novel.title}</a>
        <h1>Chapter ${chapterNumber}: ${title}</h1>
    `);

    // isi chapter baru diambil saat dibutuhkan (bukan sekaligus semua chapter)
    const rawContent = await getText(`../data/chapters/${novel.slug}/${chapterNumber}.txt`);

    const paragraphs = rawContent
        .trim()
        .split(/\n\s*\n/)
        .map((p) => `<p>${p.trim()}</p>`)
        .join("");

    render("chapter-content", paragraphs || "<p>Chapter ini belum ada isinya.</p>");

    const hasPrev = chapterNumber > 1;
    const hasNext = chapterNumber < chapterTitles.length;

    render("chapter-nav", `
        ${hasPrev
            ? `<a class="button button--secondary" href="chapter.html?slug=${novel.slug}&chapter=${chapterNumber - 1}">← Sebelumnya</a>`
            : `<span></span>`}
        ${hasNext
            ? `<a class="button button--primary" href="chapter.html?slug=${novel.slug}&chapter=${chapterNumber + 1}">Selanjutnya →</a>`
            : `<span></span>`}
    `);
}

function renderChapterSelect(novel, chapterTitles, currentNumber) {
    const options = chapterTitles
        .map(
            (title, index) => `
        <option value="${index + 1}" ${index + 1 === currentNumber ? "selected" : ""}>
            Chapter ${index + 1}: ${title}
        </option>`
        )
        .join("");

    render(
        "chapter-select-wrapper",
        `<select id="chapter-select" aria-label="Pilih chapter">${options}</select>`
    );

    const select = document.getElementById("chapter-select");
    if (select) {
        select.addEventListener("change", () => {
            window.location.href = `chapter.html?slug=${novel.slug}&chapter=${select.value}`;
        });
    }
}

function renderReadingToolbar() {
    render(
        "reading-toolbar",
        `
        <div class="text-settings-panel" id="text-settings-panel" hidden></div>

        <div class="speed-control" id="speed-control" hidden>
            <button data-speed="1">Lambat</button>
            <button data-speed="2.5" class="is-active">Sedang</button>
            <button data-speed="4.5">Cepat</button>
        </div>

        <button
            class="text-settings-btn"
            id="text-settings-toggle"
            aria-label="Pengaturan huruf">
            Aa
        </button>

        <div class="autoscroll-switch">
            <span class="autoscroll-switch__label">Auto-scroll</span>
            <button
                class="switch"
                id="autoscroll-switch"
                role="switch"
                aria-checked="false"
                aria-label="Nyalakan/matikan scroll otomatis">
            </button>
        </div>
    `
    );

    initTextSettingsPanel();

    const switchBtn = document.getElementById("autoscroll-switch");
    const speedControl = document.getElementById("speed-control");

    const scroller = createAutoScroller({
        onStop: () => {
            switchBtn.classList.remove("is-on");
            switchBtn.setAttribute("aria-checked", "false");
            speedControl.hidden = true;
        },
    });
    scroller.setSpeed(2.5); // default: Sedang

    switchBtn.addEventListener("click", () => {
        const running = scroller.toggle();

        // kalau auto-scroll baru dinyalakan, update UI di sini.
        // kalau dimatikan (baik manual maupun otomatis di ujung halaman),
        // UI-nya sudah ditangani lewat callback onStop di atas.
        if (running) {
            switchBtn.classList.add("is-on");
            switchBtn.setAttribute("aria-checked", "true");
            speedControl.hidden = false;
        }
    });

    speedControl.querySelectorAll("button").forEach((btn) => {
        btn.addEventListener("click", () => {
            scroller.setSpeed(Number(btn.dataset.speed));

            speedControl
                .querySelectorAll("button")
                .forEach((b) => b.classList.remove("is-active"));
            btn.classList.add("is-active");
        });
    });
}

async function init() {
    await loadComponents(
        [
            { id: "header", file: "layout/header.html" },
            { id: "footer", file: "layout/footer.html" },
        ],
        "../"
    );

    const { slug, chapter } = getParams();

    const novels = await getJSON("../data/novels.json");
    const chapterTitles = await getJSON(`../data/chapters/${slug}/index.json`);

    const novel = novels.find((n) => n.slug === slug);

    await renderChapter(novel, chapterTitles, chapter);

    if (novel && chapterTitles.length > 0) {
        renderChapterSelect(novel, chapterTitles, chapter);
        renderReadingToolbar();
    }
}

init();
