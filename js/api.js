/**
 * API module for external data fetching.
 */
export async function fetchQuote() {
    try {
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        if (!response.ok) throw new Error('Quote request failed');
        const data = await response.json();
        const quoteData = JSON.parse(data.contents)[0];
        return { text: quoteData.q, author: quoteData.a };
    } catch (error) {
        console.error('Error fetching quote:', error);
        return {
            text: 'The secret of getting ahead is getting started.',
            author: 'Mark Twain'
        };
    }
}

export async function searchBooks(query, options = {}) {
    const params = new URLSearchParams({
        q: query,
        maxResults: String(options.maxResults || 12),
        orderBy: options.orderBy || 'relevance',
        printType: 'books'
    });

    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?${params}`);
        if (!response.ok) throw new Error(`Google Books returned ${response.status}`);
        const data = await response.json();
        return (data.items || []).map(normalizeBook).filter(Boolean);
    } catch (error) {
        console.error('Error searching books:', error);
        throw new Error('We could not reach Google Books right now. Please try again.');
    }
}

function normalizeBook(book) {
    const info = book?.volumeInfo;
    if (!info) return null;

    const image = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '';
    return {
        id: book.id,
        title: info.title || 'Untitled book',
        authors: info.authors?.join(', ') || 'Author unavailable',
        description: stripHtml(info.description || 'No description available.'),
        cover: image.replace('http://', 'https://'),
        previewLink: info.previewLink || info.infoLink || '#',
        published: info.publishedDate || ''
    };
}

function stripHtml(value) {
    const template = document.createElement('template');
    template.innerHTML = value;
    return template.content.textContent.trim();
}
