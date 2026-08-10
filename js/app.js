/**
 * Main Application Entry Point
 */
import { initTheme } from './theme.js';
import { initNavigation, renderAssignments, renderNotes } from './ui.js';
import { addAssignment } from './assignments.js';
import { addNote } from './notes.js';
import { initTimer } from './timer.js';
import { updateProgressUI } from './progress.js';
import { displayDailyQuote } from './quotes.js';
import { handleBookSearch, renderFeaturedBooks } from './books.js';
import { initAuth } from './auth.js';
import { initGame } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) window.lucide.createIcons();
    
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString(undefined, options);
    }
    
    initTheme();
    initNavigation();
    initTimer(document.getElementById('timer-display'));
    initGame();
    
    renderAssignments('assignments-list');
    renderNotes('notes-grid');
    updateProgressUI();
    displayDailyQuote('quote-container');
    
    setupModals();
    setupSearch();
    initAuth();
    renderFeaturedBooks('books-results');
    if (window.lucide) window.lucide.createIcons();
});

function setupModals() {
    const assignmentModal = document.getElementById('assignment-modal');
    const noteModal = document.getElementById('note-modal');
    
    const addAssignBtn = document.getElementById('add-assignment-btn');
    if (addAssignBtn) {
        addAssignBtn.addEventListener('click', () => {
            assignmentModal.classList.remove('hidden');
        });
    }
    
    const addNoteBtn = document.getElementById('add-note-btn');
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            noteModal.classList.remove('hidden');
        });
    }
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            assignmentModal.classList.add('hidden');
            noteModal.classList.add('hidden');
        });
    });
    
    const assignForm = document.getElementById('assignment-form');
    if (assignForm) {
        assignForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const subject = document.getElementById('subject').value;
            const dueDate = document.getElementById('due-date').value;
            
            addAssignment({ title, subject, dueDate });
            renderAssignments('assignments-list');
            updateProgressUI();
            
            e.target.reset();
            assignmentModal.classList.add('hidden');
        });
    }
    
    const noteForm = document.getElementById('note-form');
    if (noteForm) {
        noteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('note-title').value;
            const content = document.getElementById('note-content').value;
            
            addNote({ title, content });
            renderNotes('notes-grid');
            
            e.target.reset();
            noteModal.classList.add('hidden');
        });
    }
}

function setupSearch() {
    const bookSearchBtn = document.getElementById('book-search-btn');
    const bookSearchInput = document.getElementById('book-search-input');
    
    if (bookSearchBtn && bookSearchInput) {
        bookSearchBtn.addEventListener('click', () => {
            const query = bookSearchInput.value.trim();
            if (query) {
                handleBookSearch(query, 'books-results');
            }
        });
        
        bookSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = bookSearchInput.value.trim();
                if (query) handleBookSearch(query, 'books-results');
            }
        });
    }
}
