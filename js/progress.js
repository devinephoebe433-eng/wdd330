/**
 * Progress module for calculating completion stats
 */
import { getAssignments } from './assignments.js';

export function calculateProgress() {
    const assignments = getAssignments();
    if (assignments.length === 0) return { percentage: 0, completed: 0, total: 0 };
    
    const completed = assignments.filter(a => a.completed).length;
    const total = assignments.length;
    const percentage = Math.round((completed / total) * 100);
    
    return { percentage, completed, total };
}

export function updateProgressUI() {
    const { percentage, completed, total } = calculateProgress();
    const progressBar = document.getElementById('overall-progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (progressText) progressText.textContent = `${percentage}% Completed (${completed}/${total})`;
}
