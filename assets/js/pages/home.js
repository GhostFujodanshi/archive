import { loadComponents } from "../component-loader.js";
import { getJSON } from "../modules/api.js";
import { createNovelCard } from "../modules/card.js";
import { render } from "../modules/render.js";

async function initHomepage() {
    const novels = await getJSON("data/novels.json");

    const html = novels.map((novel) => createNovelCard(novel)).join("");

    render("novel-list", html);
}

async function init() {
    await loadComponents([
        { id: "header", file: "layout/header.html" },
        { id: "footer", file: "layout/footer.html" },
        { id: "hero", file: "sections/hero.html" },
        { id: "latest", file: "sections/latest.html" },
        { id: "donation", file: "sections/donation.html" },
    ]);

    await initHomepage();
}

init();
