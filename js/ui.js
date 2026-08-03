/**
 * UI module for DOM interactions
 */
import { getAssignments, toggleAssignment, deleteAssignment } from './assignments.js';
import { getNotes, deleteNote } from './notes.js';
import { updateProgressUI } from './progress.js';

export function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
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
}

export function renderAssignments(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const assignments = getAssignments();
    if (assignments.length === 0) {
        container.innerHTML = '<p>No assignments yet. Click "Add" to start!</p>';
        return;
    }
    
    container.innerHTML = assignments.map(a => `
        <div class="item-card ${a.completed ? 'completed' : ''}" data-id="${a.id}" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; border: 1px solid var(--border-light); border-radius: 0.5rem; margin-bottom: 0.5rem;">
            <div>
                <h4 style="margin: 0;">${a.title}</h4>
                <small>${a.subject} • Due: ${a.dueDate}</small>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-sm toggle-btn" style="background: ${a.completed ? 'var(--accent-green)' : 'transparent'}; border: 1px solid var(--border-light); border-radius: 50%; width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                    <i data-lucide="check" style="width: 16px; color: ${a.completed ? 'white' : 'var(--border-light)'}"></i>
                </button>
                <button class="btn btn-sm delete-btn" style="color: #EF4444; background: transparent; border: none; cursor: pointer;"><i data-lucide="trash-2" style="width: 16px;"></i></button>
            </div>
        </div>
    `).join('');
    
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
        container.innerHTML = '<p>No notes yet. Click "New Note" to start!</p>';
        return;
    }
    
    container.innerHTML = notes.map(n => `
        <div class="card" data-id="${n.id}" style="padding: 1rem; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                <h4 style="margin: 0;">${n.title}</h4>
                <button class="btn btn-sm delete-note-btn" style="color: #EF4444; background: transparent; border: none; cursor: pointer;"><i data-lucide="trash-2" style="width: 16px;"></i></button>
            </div>
            <p style="font-size: 0.9rem; white-space: pre-wrap;">${n.content}</p>
            <small style="display: block; margin-top: 1rem; opacity: 0.6;">${new Date(n.createdAt).toLocaleDateString()}</small>
        </div>
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
