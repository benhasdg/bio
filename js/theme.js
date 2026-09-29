// Dark/light toggle. The <head> script applies the saved theme before paint;
// this just keeps the button label right and saves changes.
(() => {
    const root = document.documentElement;
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const label = () => {
        button.textContent = root.getAttribute('data-theme') === 'dark' ? 'light mode' : 'dark mode';
    };

    button.addEventListener('click', () => {
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        if (next === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.removeAttribute('data-theme');
        }
        try { localStorage.setItem('theme', next); } catch (e) {}
        label();
    });

    label();
})();

// "Get twisted": a loud animated background. Deliberately not remembered,
// so reloading the page always turns it off.
(() => {
    const root = document.documentElement;
    const button = document.getElementById('twist-toggle');
    if (!button) return;

    const label = () => {
        button.textContent = root.classList.contains('twisted') ? 'untwist' : 'get twisted';
    };

    button.addEventListener('click', () => {
        root.classList.toggle('twisted');
        label();
    });

    // Clear the setting older versions of this script saved
    try { localStorage.removeItem('twisted'); } catch (e) {}
    label();
})();
