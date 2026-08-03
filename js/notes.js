/**
 * Notes module for managing study notes
 */
import { storage, KEYS } from './storage.js';

let notes = storage.get(KEYS.NOTES) || [];

export function getNotes() {
    return notes;
}

export function addNote(note) {
    const newNote = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        ...note
    };
    notes.push(newNote);
    saveNotes();
    return newNote;
}

export function updateNote(id, updates) {
    notes = notes.map(n => n.id === id ? { ...n, ...updates } : n);
    saveNotes();
}

export function deleteNote(id) {
    notes = notes.filter(n => n.id !== id);
    saveNotes();
}

function saveNotes() {
    storage.save(KEYS.NOTES, notes);
}
