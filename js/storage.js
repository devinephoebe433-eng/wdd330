/**
 * Storage module for handling Local Storage operations
 */
export const storage = {
    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },
    
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },
    
    remove(key) {
        localStorage.removeItem(key);
    },
    
    clear() {
        localStorage.clear();
    }
};

export const KEYS = {
    ASSIGNMENTS: 'studysphere_assignments',
    NOTES: 'studysphere_notes',
    THEME: 'studysphere_theme',
    PROGRESS: 'studysphere_progress',
    GAME_HIGHSCORE: 'studysphere_highscore'
};
