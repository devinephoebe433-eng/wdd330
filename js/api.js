/**
 * API module for external data fetching
 */
export async function fetchQuote() {
    try {
        const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://zenquotes.io/api/random'));
        const data = await response.json();
        const quoteData = JSON.parse(data.contents)[0];
        return {
            text: quoteData.q,
            author: quoteData.a
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        return {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        };
    }
}

export async function searchBooks(query) {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error('Error searching books:', error);
        return [];
    }
}
