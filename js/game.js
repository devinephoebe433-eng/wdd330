/**
 * Game module: Boredom Chase - Studious Dash
 */
import { storage, KEYS } from './storage.js';

let canvas, ctx;
let score = 0;
let highScore = storage.get(KEYS.GAME_HIGHSCORE) || 0;
let gameRunning = false;
let animationId;

const player = {
    x: 50,
    y: 200,
    width: 30,
    height: 30,
    color: '#4F46E5',
    speed: 5
};

let items = [];
let obstacles = [];

export function initGame() {
    canvas = document.getElementById('game-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const startBtn = document.getElementById('start-game-btn');
    if (startBtn) startBtn.addEventListener('click', startGame);
    
    const highScoreEl = document.getElementById('game-highscore');
    if (highScoreEl) highScoreEl.textContent = highScore;
    
    window.addEventListener('keydown', handleInput);
}

function resizeCanvas() {
    const container = document.getElementById('game-container');
    if (container && canvas) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
    }
}

function handleInput(e) {
    if (!gameRunning) return;
    if (e.key === 'ArrowUp' && player.y > 0) player.y -= 20;
    if (e.key === 'ArrowDown' && player.y < canvas.height - player.height) player.y += 20;
}

function startGame() {
    gameRunning = true;
    score = 0;
    items = [];
    obstacles = [];
    player.y = canvas.height / 2;
    document.getElementById('game-overlay').classList.add('hidden');
    document.getElementById('game-score').textContent = score;
    gameLoop();
}

function gameOver() {
    gameRunning = false;
    cancelAnimationFrame(animationId);
    document.getElementById('game-overlay').classList.remove('hidden');
    document.getElementById('start-game-btn').textContent = 'Try Again';
    
    if (score > highScore) {
        highScore = score;
        storage.save(KEYS.GAME_HIGHSCORE, highScore);
        document.getElementById('game-highscore').textContent = highScore;
    }
}

function gameLoop() {
    if (!gameRunning) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x - 5, player.y, player.width + 10, 5);
    
    if (Math.random() < 0.02) {
        items.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 20),
            radius: 10,
            color: '#22C55E'
        });
    }
    
    if (Math.random() < 0.01) {
        obstacles.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 30),
            width: 30,
            height: 30,
            color: '#EF4444'
        });
    }
    
    items.forEach((item, index) => {
        item.x -= 3;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);
        ctx.fillStyle = item.color;
        ctx.fill();
        
        if (player.x < item.x + item.radius &&
            player.x + player.width > item.x - item.radius &&
            player.y < item.y + item.radius &&
            player.y + player.height > item.y - item.radius) {
            items.splice(index, 1);
            score += 10;
            document.getElementById('game-score').textContent = score;
        }
        
        if (item.x < 0) items.splice(index, 1);
    });
    
    obstacles.forEach((obs, index) => {
        obs.x -= 4;
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        
        if (player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y) {
            gameOver();
        }
        
        if (obs.x < 0) obstacles.splice(index, 1);
    });
    
    animationId = requestAnimationFrame(gameLoop);
}
