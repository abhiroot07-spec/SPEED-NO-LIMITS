const road = document.getElementById("road");
const player = document.getElementById("player");
const scoreElement = document.getElementById("score");
const speedElement = document.getElementById("speed");

let playerX = 156;
let score = 0;
let gameOver = false;
let speed = 1;
let enemies = [];
let keys = {};

document.addEventListener("keydown", (event) => {
  keys[event.key.toLower] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.key.toLower] = false;
});

function createEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.className = "car enemy";
  enemy.style.left = `${[36, 156, 276][Math.floor(Math.random() * 3)]}px`;
  enemy.style.top = "-90px";
  road.appendChild(enemy);
  enemies.push(enemy);
}

function overlaps(a, b) {
  const rectA = a.getBoundingClientRect();
  const rectB = b.getBoundingClientRect();
  return !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );
}

function endGame() {
  gameOver = true;
  document.getElementById("message").textContent =
    "Crash! Press Enter to restart";
  road.style.animationPlayState = "paused";
}

function resetGame() {
  enemies.forEach((enemy) => enemy.remove());
  enemies = [];
  score = 0;
  speed = 1;
  gameOver = false;
  playerX = 156;
  player.style.left = `${playerX}px`;
  scoreElement.textContent = "0";
  speedElement.textContent = "1";
  document.getElementById("message").textContent =
    "Use ← → or A D to drive";
  road.style.animationPlayState = "running";
}

function gameLoop() {
  if (!gameOver) {
    if ((keys.ArrowLeft || keys.a) && playerX > 36) {
      playerX -= 6;
    }
    if ((keys.ArrowRight || keys.d) && playerX < 276) {
      playerX += 6;
    }

    player.style.left = `${playerX}px`;

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.style.top = `${parseFloat(enemy.style.top) + 4 * speed}px`;

      if (overlaps(player, enemy)) {
        endGame();
      }

      if (parseFloat(enemy.style.top) > 550) {
        enemy.remove();
        enemies.splice(i, 1);
        score += 10;
        scoreElement.textContent = score;
        speed = Math.min(3, 1 + Math.floor(score / 100));
        speedElement.textContent = speed;
      }
    }
  }

  if (keys.enter && gameOver) {
    resetGame();
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && gameOver) resetGame();
});

setInterval(createEnemy, 1100);
gameLoop();