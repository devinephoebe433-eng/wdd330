const AUTH_KEY = 'studysphere_user';

export function initAuth() {
    const modal = document.getElementById('auth-modal');
    const signInButton = document.getElementById('signin-btn');
    const form = document.getElementById('auth-form');
    const status = document.getElementById('auth-status');
    const closeButton = document.querySelector('.close-auth');
    if (!modal || !signInButton || !form) return;

    const savedUser = getSavedUser();
    if (savedUser) setSignedInState(signInButton, savedUser);

    signInButton.addEventListener('click', () => {
        if (getSavedUser()) {
            localStorage.removeItem(AUTH_KEY);
            signInButton.innerHTML = '<i data-lucide="user-round"></i><span>Sign in</span>';
            signInButton.setAttribute('aria-label', 'Open sign in');
            if (window.lucide) window.lucide.createIcons();
            return;
        }
        modal.classList.remove('hidden');
        document.getElementById('auth-email')?.focus();
    });

    closeButton?.addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', event => {
        if (event.target === modal) closeModal(modal);
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('auth-email').value.trim();
        const password = document.getElementById('auth-password').value;
        const remember = document.getElementById('remember-me').checked;
        if (!email || password.length < 6) {
            status.textContent = 'Enter a valid email and a password with at least 6 characters.';
            status.className = 'auth-status is-error';
            return;
        }

        const user = { email, name: email.split('@')[0].replace(/[._-]/g, ' ') };
        if (remember) localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        setSignedInState(signInButton, user);
        status.textContent = 'You are signed in. Welcome back.';
        status.className = 'auth-status is-success';
        setTimeout(() => closeModal(modal), 700);
    });
}

function getSavedUser() {
    try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
}

function setSignedInState(button, user) {
    button.innerHTML = `<i data-lucide="circle-check"></i><span>${capitalize(user.name)}</span>`;
    button.setAttribute('aria-label', 'Sign out');
    button.setAttribute('title', 'Sign out');
    if (window.lucide) window.lucide.createIcons();
}

function capitalize(value) {
    return value.replace(/\b\w/g, letter => letter.toUpperCase());
}

function closeModal(modal) {
    modal.classList.add('hidden');
}
