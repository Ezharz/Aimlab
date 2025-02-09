const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('scoreDisplay');
const timerDisplay = document.getElementById('timerDisplay');
const startScreen = document.getElementById('startScreen');
const startButton = document.getElementById('startButton');

let score = 0;
let timeLeft = 30;
let targets = [];
let gameActive = false;

function createTarget() {
    const minSize = 10;
    const maxSize = 40;
    return {
        x: Math.random() * (canvas.width - maxSize),
        y: Math.random() * (canvas.height - maxSize),
        radius: Math.random() * (maxSize - minSize) + minSize,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`
    };
}

function drawTarget(target) {
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = target.color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function gameLoop() {
    if (!gameActive) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    targets.forEach(drawTarget);

    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
        gameActive = false;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'bold 40px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`Game Over! Final Score: ${score}`, canvas.width / 2, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText('Click to play again', canvas.width / 2, canvas.height / 2 + 40);
        return;
    }

    requestAnimationFrame(gameLoop);
}

function startGame() {
    score = 0;
    timeLeft = 30;
    targets = [createTarget()];
    gameActive = true;
    startScreen.style.display = 'none';

    const timer = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timer);
        }
    }, 1000);

    const targetSpawner = setInterval(() => {
        if (targets.length < 3) {
            targets.push(createTarget());
        }
    }, 1000);

    gameLoop();
}

canvas.addEventListener('click', (event) => {
    if (!gameActive) {
        startGame();
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (let i = targets.length - 1; i >= 0; i--) {
        const target = targets[i];
        const distance = Math.sqrt((x - target.x) ** 2 + (y - target.y) ** 2);
        if (distance < target.radius) {
            score += Math.round(50 / target.radius);  // Smaller targets give more points
            targets.splice(i, 1);
            break;
        }
    }
});

startButton.addEventListener('click', startGame);