// 2d-collector.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const player = { x: 50, y: 50, size: 32, color: "lime" };
const keys = {};

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function update() {
  if (keys["w"]) player.y -= 2;
  if (keys["s"]) player.y += 2;
  if (keys["a"]) player.x -= 2;
  if (keys["d"]) player.x += 2;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

gameLoop();
