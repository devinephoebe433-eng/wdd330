/**
 * Timer module for Pomodoro functionality
 */
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isPaused = true;

export function initTimer(displayElement, onTick) {
    updateDisplay(displayElement);
    
    const startBtn = document.getElementById('start-timer');
    const pauseBtn = document.getElementById('pause-timer');
    const resetBtn = document.getElementById('reset-timer');
    
    if (startBtn) startBtn.addEventListener('click', () => start(displayElement, onTick));
    if (pauseBtn) pauseBtn.addEventListener('click', pause);
    if (resetBtn) resetBtn.addEventListener('click', () => reset(displayElement));
    
    document.querySelectorAll('.timer-settings button').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.time);
            setTime(minutes, displayElement);
        });
    });
}

function start(displayElement, onTick) {
    if (!isPaused) return;
    isPaused = false;
    
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateDisplay(displayElement);
            if (onTick) onTick(timeLeft);
        } else {
            clearInterval(timerInterval);
            isPaused = true;
            alert('Time is up!');
        }
    }, 1000);
}

function pause() {
    isPaused = true;
    clearInterval(timerInterval);
}

function reset(displayElement) {
    pause();
    timeLeft = 25 * 60;
    updateDisplay(displayElement);
}

function setTime(minutes, displayElement) {
    pause();
    timeLeft = minutes * 60;
    updateDisplay(displayElement);
}

function updateDisplay(displayElement) {
    if (!displayElement) return;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    displayElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
