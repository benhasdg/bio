const toggle = document.getElementById('theme-toggle');
const icon = document.getElementById('toggle-icon');
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    icon.textContent = '\u{1F319}';
} else {
    icon.textContent = '\u{2600}\u{FE0F}';
}
toggle.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        icon.textContent = '\u{2600}\u{FE0F}';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        icon.textContent = '\u{1F319}';
    }
});
