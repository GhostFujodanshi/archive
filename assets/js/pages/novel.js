import { loadComponents } from "../component-loader.js";
import { getJSON } from "../modules/api.js";
import { render } from "../modules/render.js";

function getSlugFromURL() {
    return new URLSearchParams(window.location.search).get("slug");
}

function updateMetaTags(novel) {
    const title = `${novel.title} - Ghost Fujodanshi Scanlation`;
    const description = novel.synopsis.length > 155
        ? novel.synopsis.slice(0, 152) + "..."
        : novel.synopsis;
    const coverURL = `https://ghostfujodanshi.github.io/archive/${novel.cover}`;

    document.title = title;

    const setContent = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.setAttribute("content", value);
    };

    setContent("page-description", description);
    setContent("og-title", title);
    setContent("og-description", description);
    setContent("og-image", coverURL);
    setContent("twitter-title", title);
    setContent("twitter-description", description);
}

function renderNovelDetail(novel) {
    if (!novel) {
        render("novel-detail", `<p>Novel tidak ditemukan.</p>`);
        return;
    }

    updateMetaTags(novel);

    const genresHTML = novel.genres
        .map((g) => `<span class="badge">${g}</span>`)
        .join("");

    render("novel-detail", `
        <div class="novel-detail__cover">
            <img src="../${novel.cover}" alt="${novel.title}">
        </div>
        <div class="novel-detail__info">
            <div class="novel-detail__genres">${genresHTML}</div>
            <h1>${novel.title}</h1>
            <p class="novel-detail__author">oleh ${novel.author}</p>
            <div class="novel-detail__meta">
                <span>${novel.status}</span>
                <span>${novel.chapters} Chapter</span>
            </div>
            <p class="novel-detail__synopsis">${novel.synopsis}</p>
        </div>
    `);
}

function renderChapterList(slug, chapterTitles) {
    if (!chapterTitles || chapterTitles.length === 0) {
        render("chapter-list", `<h2>Daftar Chapter</h2><p>Belum ada chapter.</p>`);
        return;
    }

    const items = chapterTitles
        .map(
            (title, index) => `
        <a class="chapter-item" href="chapter.html?slug=${slug}&chapter=${index + 1}">
            Chapter ${index + 1}: ${title}
        </a>`
        )
        .join("");

    render("chapter-list", `<h2>Daftar Chapter</h2><div class="chapter-list__items">${items}</div>`);
}

async function init() {
    await loadComponents(
        [
            { id: "header", file: "layout/header.html" },
            { id: "footer", file: "layout/footer.html" },
        ],
        "../"
    );

    const slug = getSlugFromURL();
    const novels = await getJSON("../data/novels.json");
    const chapterTitles = await getJSON(`../data/chapters/${slug}/index.json`);

    const novel = novels.find((n) => n.slug === slug);

    renderNovelDetail(novel);
    renderChapterList(slug, chapterTitles);
}

init();
