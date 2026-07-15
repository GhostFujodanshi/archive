import { loadComponents } from "../component-loader.js";
import { getJSON } from "../modules/api.js";
import { createNovelCard } from "../modules/card.js";
import { render } from "../modules/render.js";

function getQuery() {
    return (new URLSearchParams(window.location.search).get("q") || "").trim();
}

function searchNovels(novels, query) {
    const q = query.toLowerCase();

    return novels.filter((novel) => {
        const inTitle = novel.title.toLowerCase().includes(q);
        const inAuthor = novel.author?.toLowerCase().includes(q);
        const inGenre = novel.genres.some((g) => g.toLowerCase().includes(q));
        return inTitle || inAuthor || inGenre;
    });
}

function renderResults(query, results) {
    const heading = document.getElementById("search-heading");
    if (heading) {
        heading.textContent = query
            ? `Hasil pencarian: "${query}"`
            : "Cari Novel";
    }

    if (!query) {
        render("search-results", `<p>Ketik judul, penulis, atau genre di kotak pencarian.</p>`);
        return;
    }

    if (results.length === 0) {
        render(
            "search-results",
            `<p>Novel dengan kata kunci "${query}" tidak ditemukan. Coba kata kunci lain.</p>`
        );
        return;
    }

    const html = results.map((n) => createNovelCard(n, "../")).join("");
    render("search-results", html);
}

async function init() {
    await loadComponents(
        [
            { id: "header", file: "layout/header.html" },
            { id: "footer", file: "layout/footer.html" },
        ],
        "../"
    );

    const query = getQuery();
    document.title = query
        ? `Cari: ${query} - Ghost Fujodanshi Scanlation`
        : "Cari Novel - Ghost Fujodanshi Scanlation";

    // isi kembali kotak pencarian di header dengan kata kunci saat ini
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = query;

    const novels = await getJSON("../data/novels.json");
    const results = query ? searchNovels(novels, query) : [];

    renderResults(query, results);
}

init();
