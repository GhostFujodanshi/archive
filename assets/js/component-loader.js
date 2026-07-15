// Loader generik untuk semua halaman.
// basePath dipakai supaya path fetch tetap benar walau file HTML
// ada di kedalaman folder berbeda (contoh: index.html di root vs pages/novel.html)

export async function loadComponent(id, file, basePath = "") {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const response = await fetch(`${basePath}components/${file}`);
        const html = await response.text();
        element.innerHTML = html;
    } catch (error) {
        console.error("Component gagal dimuat:", file, error);
    }
}

export async function loadComponents(list, basePath = "") {
    await Promise.all(
        list.map(({ id, file }) => loadComponent(id, file, basePath))
    );

    if (list.some((item) => item.id === "header")) {
        initHeaderMenu(basePath);
    }

    document.dispatchEvent(new Event("components:ready"));
}

function initHeaderMenu(basePath) {
    const menuBtn = document.getElementById("menu-btn");
    const nav = document.getElementById("nav");
    if (!menuBtn || !nav) return;

    // perbaiki link nav (Home/Novel/Genre/Donasi) supaya tetap benar
    // baik dibuka dari index.html (root) maupun pages/novel.html, pages/chapter.html
    document.querySelectorAll("[data-root-link]").forEach((link) => {
        link.setAttribute("href", basePath + link.dataset.rootLink);
    });

    menuBtn.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("is-open");
        menuBtn.setAttribute("aria-expanded", isOpen);
        menuBtn.textContent = isOpen ? "✕" : "☰";
    });

    // tutup menu otomatis kalau salah satu link nav diklik
    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.textContent = "☰";
        });
    });

    const searchForm = document.getElementById("search-form");
    if (searchForm) {
        searchForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const query = searchForm.querySelector("#search-input").value.trim();
            const searchPage = (basePath === "" ? "pages/" : "") + "search.html";

            window.location.href = `${searchPage}?q=${encodeURIComponent(query)}`;
        });
    }
}
