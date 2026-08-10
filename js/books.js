import { searchBooks } from './api.js';

const FEATURED_BOOKS = [
    { title: 'Learning Web Design', authors: 'Jennifer Niederst Robbins', description: 'A friendly guide to HTML, CSS, JavaScript, and the foundations of modern web experiences.', cover: 'assets/photos/study-desk.jpg', previewLink: 'https://books.google.com/books?id=V1JEDwAAQBAJ' },
    { title: 'Atomic Habits', authors: 'James Clear', description: 'Practical strategies for building better habits and making progress that lasts.', cover: 'assets/photos/library-reading.jpg', previewLink: 'https://books.google.com/books?id=8V9cDwAAQBAJ' },
    { title: 'Don’t Make Me Think', authors: 'Steve Krug', description: 'A classic, practical introduction to intuitive navigation and user-friendly design.', cover: 'assets/photos/study-notes.jpg', previewLink: 'https://books.google.com/books?id=Q6ZQDwAAQBAJ' }
];

export function renderFeaturedBooks(resultsContainerId) {
    const container = document.getElementById(resultsContainerId);
    const status = document.getElementById('books-status');
    if (!container) return;
    if (status) status.textContent = 'A few strong places to start your reading list.';
    container.innerHTML = FEATURED_BOOKS.map(book => renderBookCard(book, true)).join('');
}

export async function handleBookSearch(query, resultsContainerId) {
    const container = document.getElementById(resultsContainerId);
    const status = document.getElementById('books-status');
    if (!container) return;
    container.innerHTML = '';
    if (status) status.textContent = `Searching Google Books for “${query}”…`;
    try {
        const books = await searchBooks(query);
        if (books.length === 0) {
            if (status) status.textContent = `No books found for “${query}”. Try a broader topic.`;
            container.innerHTML = '<p class="books-empty">No results yet. Try another search.</p>';
            return;
        }
        if (status) status.textContent = `${books.length} reading options found for “${query}”.`;
        container.innerHTML = books.map(book => renderBookCard(book)).join('');
    } catch (error) {
        if (status) status.textContent = error.message;
        container.innerHTML = '<p class="books-empty">Please check your connection and try the search again.</p>';
    }
}

function renderBookCard(book, featured = false) {
    const cover = book.cover || 'assets/photos/study-notes.jpg';
    return `
        <article class="book-card${featured ? ' featured-book' : ''}">
            <img class="book-cover" src="${escapeAttribute(cover)}" alt="${escapeHtml(book.title)} cover" loading="lazy" onerror="this.onerror=null;this.src='assets/photos/study-notes.jpg';">
            <div class="book-card-copy"><h4>${escapeHtml(book.title)}</h4><p class="book-author">${escapeHtml(book.authors)}</p><p class="book-description">${escapeHtml(book.description || 'No description available.')}</p></div>
            <a href="${escapeAttribute(book.previewLink || '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">View book <i data-lucide="arrow-up-right"></i></a>
        </article>`;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}
function escapeAttribute(value) { return escapeHtml(value).replace(/`/g, '&#96;'); }
