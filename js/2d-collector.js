// 2d-collector.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const tileSize = 32;
const keys = {};

let level = 0;
const levels = [
  [
    "................",
    "..P.......D.....",
    ".....T..........",
    ".............D..",
    "....T...........",
    ".............X..",
    "................"
  ],
  [
    "................",
    "..P...T...D.....",
    ".....D......T...",
    ".............D..",
    "....T.....D.....",
    ".............X..",
    "................"
  ]
];

const player = { x: 1, y: 1, color: "lime", collected: 0 };

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function drawMap() {
  const map = levels[level];
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const cell = map[y][x];
      if (cell === "T") drawTile(x, y, "red"); // Trap
      else if (cell === "D") drawTile(x, y, "cyan"); // Diamond
      else if (cell === "X") drawTile(x, y, "gold"); // Exit
    }
  }
}

function drawPlayer() {
  drawTile(player.x, player.y, player.color);
}

function update() {
  const map = levels[level];
  if (keys["w"] && player.y > 0) player.y--;
  if (keys["s"] && player.y < map.length - 1) player.y++;
  if (keys["a"] && player.x > 0) player.x--;
  if (keys["d"] && player.x < map[0].length - 1) player.x++;

  const current = map[player.y][player.x];

  if (current === "D") {
    map[player.y] = map[player.y].substring(0, player.x) + "." + map[player.y].substring(player.x + 1);
    player.collected++;
  } else if (current === "T") {
    alert("You hit a trap! Game over.");
    resetGame();
  } else if (current === "X" && player.collected >= 3) {
    level++;
    if (level >= levels.length) {
      alert("You win! Game complete.");
      resetGame();
    } else {
      player.x = 1;
      player.y = 1;
      player.collected = 0;
    }
  }
}

function resetGame() {
  level = 0;
  player.x = 1;
  player.y = 1;
  player.collected = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMap();
  update();
  drawPlayer();
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", e => keys[e.key.toLowerCase()] = false);

gameLoop();