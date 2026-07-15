export function render(containerId, html) {

    const element = document.getElementById(containerId);

    if (!element) return;

    element.innerHTML = html;

}