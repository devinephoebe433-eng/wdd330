/**
 * Assignments module for managing tasks
 */
import { storage, KEYS } from './storage.js';

let assignments = storage.get(KEYS.ASSIGNMENTS) || [];

export function getAssignments() {
    return assignments;
}

export function addAssignment(assignment) {
    const newAssignment = {
        id: Date.now().toString(),
        completed: false,
        ...assignment
    };
    assignments.push(newAssignment);
    saveAssignments();
    return newAssignment;
}

export function updateAssignment(id, updates) {
    assignments = assignments.map(a => a.id === id ? { ...a, ...updates } : a);
    saveAssignments();
}

export function deleteAssignment(id) {
    assignments = assignments.filter(a => a.id !== id);
    saveAssignments();
}

export function toggleAssignment(id) {
    assignments = assignments.map(a => 
        a.id === id ? { ...a, completed: !a.completed } : a
    );
    saveAssignments();
}

function saveAssignments() {
    storage.save(KEYS.ASSIGNMENTS, assignments);
}

export function searchAssignments(query) {
    return assignments.filter(a => 
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.subject.toLowerCase().includes(query.toLowerCase())
    );
}
