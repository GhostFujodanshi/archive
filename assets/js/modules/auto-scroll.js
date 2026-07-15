// Module kecil untuk fitur scroll otomatis (hands-free reading).
// Dipakai di halaman baca chapter.

export function createAutoScroller({ onStop } = {}) {
    let intervalId = null;
    let pxPerTick = 2; // jarak scroll tiap tick, diatur lewat setSpeed()

    function tick() {
        window.scrollBy(0, pxPerTick);

        const reachedBottom =
            window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;

        if (reachedBottom) stop();
    }

    function start() {
        if (intervalId) return;
        intervalId = setInterval(tick, 40);
    }

    function stop() {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = null;
        if (onStop) onStop();
    }

    function toggle() {
        if (intervalId) {
            stop();
        } else {
            start();
        }
        return isRunning();
    }

    function setSpeed(px) {
        pxPerTick = px;
    }

    function isRunning() {
        return intervalId !== null;
    }

    return { start, stop, toggle, setSpeed, isRunning };
}
