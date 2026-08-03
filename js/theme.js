/**
 * Theme module for handling light/dark mode
 */
import { storage, KEYS } from './storage.js';

export function initTheme() {
    const savedTheme = storage.get(KEYS.THEME) || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcons('dark');
    }
    
    const toggleBtns = [
        document.getElementById('theme-toggle-desktop'),
        document.getElementById('theme-toggle-mobile')
    ];
    
    toggleBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    });
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    const theme = isDark ? 'dark' : 'light';
    storage.save(KEYS.THEME, theme);
    updateThemeIcons(theme);
}

function updateThemeIcons(theme) {
    const darkIcons = document.querySelectorAll('.dark-icon');
    const lightIcons = document.querySelectorAll('.light-icon');
    
    if (theme === 'dark') {
        darkIcons.forEach(icon => icon.classList.add('hidden'));
        lightIcons.forEach(icon => icon.classList.remove('hidden'));
    } else {
        darkIcons.forEach(icon => icon.classList.remove('hidden'));
        lightIcons.forEach(icon => icon.classList.add('hidden'));
    }
}
