import { loadComponents } from "../component-loader.js";
import { getJSON } from "../modules/api.js";
import { createNovelCard } from "../modules/card.js";
import { render } from "../modules/render.js";

function getSelectedGenre() {
    return new URLSearchParams(window.location.search).get("genre");
}

function renderGenreFilter(genres, selected) {
    const allChip = `
        <a class="genre-chip ${!selected ? "is-active" : ""}" href="novels.html">
            Semua
        </a>`;

    const chips = genres
        .map(
            (g) => `
        <a class="genre-chip ${selected === g ? "is-active" : ""}" href="novels.html?genre=${encodeURIComponent(g)}">
            ${g}
        </a>`
        )
        .join("");

    render("genre-filter", allChip + chips);
}

function renderNovelList(novels, selected) {
    const filtered = selected
        ? novels.filter((n) => n.genres.includes(selected))
        : novels;

    if (filtered.length === 0) {
        render("novel-list-all", `<p>Belum ada novel untuk genre ini.</p>`);
        return;
    }

    const html = filtered.map((n) => createNovelCard(n, "../")).join("");
    render("novel-list-all", html);
}

async function init() {
    await loadComponents(
        [
            { id: "header", file: "layout/header.html" },
            { id: "footer", file: "layout/footer.html" },
        ],
        "../"
    );

    const genres = await getJSON("../data/genres.json");
    const novels = await getJSON("../data/novels.json");
    const selected = getSelectedGenre();

    if (selected) {
        document.title = `Genre: ${selected} - Ghost Fujodanshi Scanlation`;
    }

    renderGenreFilter(genres, selected);
    renderNovelList(novels, selected);
}

init();
