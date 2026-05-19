
            
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let score = 0;
let level = 1;
let speedBoost = 1;
let gameRunning = true;

// Road animation
let roadY = 0;

// Player
let player = {
  x: 250,
  y: 500,
  size: 30,
  speed: 6
};

// Enemies
let enemies = [];

// Spawn enemy
function spawnEnemy() {
  enemies.push({
    x: Math.random() * 450,
    y: 0,
    size: Math.random() * 25 + 15,
    speed: (Math.random() * 2 + 1) * speedBoost
  });
}

// Difficulty increase
setInterval(() => {
  if (!gameRunning) return;
  spawnEnemy();
  speedBoost += 0.03;
}, 1000);

// Level system
function updateLevel() {
  level = Math.floor(score / 100) + 1;
  document.getElementById("level").innerText = level;
}

// Controls (keyboard)
document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;

  if (e.key === "ArrowLeft") player.x -= player.speed;
  if (e.key === "ArrowRight") player.x += player.speed;
  if (e.key === "ArrowUp") player.y -= player.speed;
  if (e.key === "ArrowDown") player.y += player.speed;
});

// Mobile buttons
function move(dir) {
  if (!gameRunning) return;

  if (dir === "left") player.x -= player.speed * 10;
  if (dir === "right") player.x += player.speed * 10;
  if (dir === "up") player.y -= player.speed * 10;
  if (dir === "down") player.y += player.speed * 10;
}

// Touch swipe control
let startX = 0;

canvas.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

canvas.addEventListener("touchmove", (e) => {
  let diff = e.touches[0].clientX - startX;
  player.x += diff * 0.05;
});

// Collision
function collide(a, b) {
  return (
    a.x < b.x + b.size &&
    a.x + a.size > b.x &&
    a.y < b.y + b.size &&
    a.y + a.size > b.y
  );
}

// Game over
function endGame() {
  gameRunning = false;
  document.getElementById("gameOver").style.display = "block";
}

// Restart
function restart() {
  location.reload();
}

// Road drawing
function drawRoad() {
  roadY += 5;
  if (roadY > canvas.height) roadY = 0;

  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 4;

  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.moveTo(250, i * 60 + roadY);
    ctx.lineTo(250, i * 60 + 30 + roadY);
    ctx.stroke();
  }
}

// Game loop
function update() {
  if (!gameRunning) return;

  drawRoad();

  // Player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // Enemies
  for (let i = 0; i < enemies.length; i++) {
    let enemy = enemies[i];
    enemy.y += enemy.speed;

    ctx.fillStyle = "red";
    ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

    if (collide(player, enemy)) {
      if (player.size >= enemy.size) {
        player.size += 1.5;
        score += 10;
        document.getElementById("score").innerText = score;
        updateLevel();
        enemies.splice(i, 1);
      } else {
        endGame();
      }
    }

    if (enemy.y > canvas.height) {
      enemies.splice(i, 1);
    }
  }

  requestAnimationFrame(update);
}

update();
            
    
