import { loadComponents } from "../component-loader.js";
import { getJSON } from "../modules/api.js";
import { render } from "../modules/render.js";

function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        slug: params.get("slug"),
        chapter: Number(params.get("chapter")) || 1,
    };
}

function renderChapter(novel, chapters, chapterNumber) {
    const chapter = chapters.find((c) => c.number === chapterNumber);

    if (!novel || !chapter) {
        render("chapter-content", `<p>Chapter tidak ditemukan.</p>`);
        return;
    }

    document.title = `${novel.title} - Chapter ${chapter.number} - Ghost Fujodanshi Scanlation`;

    render("chapter-header", `
        <a href="novel.html?slug=${novel.slug}" class="chapter-back">← ${novel.title}</a>
        <h1>Chapter ${chapter.number}: ${chapter.title}</h1>
    `);

    const paragraphs = chapter.content
        .split("\n\n")
        .map((p) => `<p>${p}</p>`)
        .join("");

    render("chapter-content", paragraphs);

    const hasPrev = chapters.some((c) => c.number === chapterNumber - 1);
    const hasNext = chapters.some((c) => c.number === chapterNumber + 1);

    render("chapter-nav", `
        ${hasPrev
            ? `<a class="button button--secondary" href="chapter.html?slug=${novel.slug}&chapter=${chapterNumber - 1}">← Sebelumnya</a>`
            : `<span></span>`}
        ${hasNext
            ? `<a class="button button--primary" href="chapter.html?slug=${novel.slug}&chapter=${chapterNumber + 1}">Selanjutnya →</a>`
            : `<span></span>`}
    `);
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
    const chaptersData = await getJSON("../data/chapters.json");

    const novel = novels.find((n) => n.slug === slug);
    const chapters = chaptersData[slug] || [];

    renderChapter(novel, chapters, chapter);
}

init();
