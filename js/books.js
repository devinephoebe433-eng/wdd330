/**
 * Books module for handling book search
 */
import { searchBooks } from './api.js';

export async function handleBookSearch(query, resultsContainerId) {
    const container = document.getElementById(resultsContainerId);
    if (!container) return;
    
    container.innerHTML = '<p class="loading">Searching for resources...</p>';
    
    const books = await searchBooks(query);
    
    if (books.length === 0) {
        container.innerHTML = '<p>No books found. Try a different search.</p>';
        return;
    }
    
    container.innerHTML = books.map(book => {
        const info = book.volumeInfo;
        const thumbnail = info.imageLinks ? info.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Cover';
        const title = info.title || 'Unknown Title';
        const authors = info.authors ? info.authors.join(', ') : 'Unknown Author';
        const previewLink = info.previewLink || '#';
        
        return `
            <div class="card book-card" style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; background: var(--card-bg-light); border-radius: 0.5rem; box-shadow: var(--shadow);">
                <img src="${thumbnail}" alt="${title}" style="width: 100px; height: 150px; object-fit: cover; border-radius: 0.25rem; margin-bottom: 0.5rem;">
                <h4 style="font-size: 1rem; margin: 0;">${title}</h4>
                <p style="font-size: 0.8rem; color: var(--text-light); opacity: 0.8;">${authors}</p>
                <a href="${previewLink}" target="_blank" class="btn btn-outline" style="font-size: 0.8rem; margin-top: auto;">Preview</a>
            </div>
        `;
    }).join('');
}
