/**
 * Quotes module for handling motivational quotes
 */
import { fetchQuote } from './api.js';

export async function displayDailyQuote(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '<p class="loading">Loading motivation...</p>';
    
    const quote = await fetchQuote();
    container.innerHTML = `
        <blockquote style="font-style: italic; font-size: 1.1rem; margin-bottom: 0.5rem;">"${quote.text}"</blockquote>
        <cite style="display: block; text-align: right; color: var(--primary-blue); font-weight: 500;">— ${quote.author}</cite>
    `;
}
