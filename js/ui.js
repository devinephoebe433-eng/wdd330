/**
 * UI module for DOM interactions.
 */
import { getAssignments, toggleAssignment, deleteAssignment } from './assignments.js';
import { getNotes, deleteNote } from './notes.js';
import { updateProgressUI } from './progress.js';

function escapeHTML(value = '') {
    return String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#039;',
        '"': '&quot;'
    }[character]));
}

function getDueStatus(dueDate, completed) {
    if (completed) return { label: 'Completed', color: 'var(--accent-green)' };

    const due = new Date(`${dueDate}T23:59:59`);
    if (Number.isNaN(due.getTime())) return { label: `Due: ${escapeHTML(dueDate)}`, color: 'var(--text-light)' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDay = new Date(due);
    dueDay.setHours(0, 0, 0, 0);
    const daysUntilDue = Math.ceil((dueDay - today) / 86400000);

    if (daysUntilDue < 0) return { label: 'Overdue', color: '#dc2626' };
    if (daysUntilDue === 0) return { label: 'Due today', color: '#d97706' };
    return { label: `Due ${due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`, color: 'var(--text-light)' };
}

export function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a, .quick-link, a[data-section]');
    const sections = document.querySelectorAll('.section');
    const pageTitle = document.getElementById('page-title');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.add('hidden'));
            const targetSection = document.getElementById(`${targetId}-section`);
            if (targetSection) targetSection.classList.remove('hidden');

            if (pageTitle) {
                const span = link.querySelector('span');
                pageTitle.textContent = span ? span.textContent : targetId.charAt(0).toUpperCase() + targetId.slice(1);
            }
        });
    });

    const initialSection = window.location.hash.replace('#', '');
    const initialLink = [...navLinks].find(link => link.dataset.section === initialSection);
    if (initialLink) initialLink.click();
}

export function renderAssignments(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const assignments = [...getAssignments()].sort((a, b) => {
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
        return String(a.dueDate).localeCompare(String(b.dueDate));
    });

    if (assignments.length === 0) {
        container.innerHTML = '<p class="empty-state">No assignments yet. Click “Add” to start planning your week.</p>';
        return;
    }

    container.innerHTML = assignments.map(a => {
        const dueStatus = getDueStatus(a.dueDate, a.completed);
        return `
        <article class="item-card ${a.completed ? 'completed' : ''}" data-id="${escapeHTML(a.id)}" style="display: flex; justify-content: space-between; align-items: center; gap: 1rem; padding: 1rem; border: 1px solid var(--border-light); border-radius: 0.5rem; margin-bottom: 0.5rem;">
            <div style="min-width: 0;">
                <h4 style="margin: 0; overflow-wrap: anywhere;">${escapeHTML(a.title)}</h4>
                <small>${escapeHTML(a.subject)} <span aria-hidden="true">•</span> <span style="color: ${dueStatus.color}; font-weight: 600;">${dueStatus.label}</span></small>
            </div>
            <div style="display: flex; gap: 0.5rem; flex-shrink: 0;">
                <button type="button" class="btn btn-sm toggle-btn" aria-label="${a.completed ? 'Mark ' + escapeHTML(a.title) + ' incomplete' : 'Mark ' + escapeHTML(a.title) + ' complete'}" title="${a.completed ? 'Mark incomplete' : 'Mark complete'}" style="background: ${a.completed ? 'var(--accent-green)' : 'transparent'}; border: 1px solid var(--border-light); border-radius: 50%; width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <i data-lucide="check" aria-hidden="true" style="width: 16px; color: ${a.completed ? 'white' : 'var(--border-light)'}"></i>
                </button>
                <button type="button" class="btn btn-sm delete-btn" aria-label="Delete ${escapeHTML(a.title)}" title="Delete assignment" style="color: #EF4444; background: transparent; border: none; cursor: pointer;"><i data-lucide="trash-2" aria-hidden="true" style="width: 16px;"></i></button>
            </div>
        </article>`;
    }).join('');

    if (window.lucide) window.lucide.createIcons();

    container.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.closest('.item-card').dataset.id;
            toggleAssignment(id);
            renderAssignments(containerId);
            updateProgressUI();
        });
    });

    container.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.closest('.item-card').dataset.id;
            deleteAssignment(id);
            renderAssignments(containerId);
            updateProgressUI();
        });
    });
}

export function renderNotes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const notes = getNotes();
    if (notes.length === 0) {
        container.innerHTML = '<p class="empty-state">No notes yet. Click “New Note” to capture an idea.</p>';
        return;
    }

    container.innerHTML = notes.map(n => `
        <article class="card" data-id="${escapeHTML(n.id)}" style="padding: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.5rem;">
                <h4 style="margin: 0; overflow-wrap: anywhere;">${escapeHTML(n.title)}</h4>
                <button type="button" class="btn btn-sm delete-note-btn" aria-label="Delete ${escapeHTML(n.title)}" title="Delete note" style="color: #EF4444; background: transparent; border: none; cursor: pointer;"><i data-lucide="trash-2" aria-hidden="true" style="width: 16px;"></i></button>
            </div>
            <p style="font-size: 0.9rem; white-space: pre-wrap; overflow-wrap: anywhere;">${escapeHTML(n.content)}</p>
            <small style="display: block; margin-top: 1rem; opacity: 0.6;">${new Date(n.createdAt).toLocaleDateString()}</small>
        </article>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    container.querySelectorAll('.delete-note-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.closest('.card').dataset.id;
            deleteNote(id);
            renderNotes(containerId);
        });
    });
}
