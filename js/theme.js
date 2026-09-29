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

// "Get twisted": a loud animated background. Remembered like the theme.
(() => {
    const root = document.documentElement;
    const button = document.getElementById('twist-toggle');
    if (!button) return;

    const label = () => {
        button.textContent = root.classList.contains('twisted') ? 'untwist' : 'get twisted';
    };

    button.addEventListener('click', () => {
        const on = root.classList.toggle('twisted');
        try { localStorage.setItem('twisted', on ? 'on' : 'off'); } catch (e) {}
        label();
    });

    label();
})();
