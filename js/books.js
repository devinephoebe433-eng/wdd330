/**
 * Books module for handling Google Books search.
 */
import { searchBooks } from './api.js';

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
        container.innerHTML = books.map(renderBookCard).join('');
    } catch (error) {
        if (status) status.textContent = error.message;
        container.innerHTML = '<p class="books-empty">Please check your connection and try the search again.</p>';
    }
}

function renderBookCard(book) {
    const cover = book.cover || 'assets/photos/study-notes.jpg';
    const coverAlt = `${escapeHtml(book.title)} cover`;
    const published = book.published ? `<span>${escapeHtml(book.published)}</span>` : '';

    return `
        <article class="book-card">
            <img class="book-cover" src="${escapeAttribute(cover)}" alt="${coverAlt}" loading="lazy">
            <h4>${escapeHtml(book.title)}</h4>
            <p class="book-author">${escapeHtml(book.authors)}</p>
            <p class="book-description">${escapeHtml(book.description)}</p>
            ${published}
            <a href="${escapeAttribute(book.previewLink)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">View preview</a>
        </article>
    `;
}

function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    })[character]);
}

function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
}
