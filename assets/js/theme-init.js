// Script ini SENGAJA bukan type="module" dan diletakkan sebelum CSS,
// supaya tema gelap langsung aktif sebelum halaman sempat "kelihatan"
// (mencegah flash tema terang sekilas saat halaman baru dibuka)
(function () {
    var saved = localStorage.getItem("gf-theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (prefersDark ? "dark" : "light");

    document.documentElement.setAttribute("data-theme", theme);
})();
