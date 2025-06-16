window.onload = function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 48;
  const rows = 12;
  const cols = 20;
  canvas.width = cols * tileSize;
  canvas.height = rows * tileSize;

  const backgrounds = [];
  for (let i = 1; i <= 10; i++) {
    const img = new Image();
    img.src = "../assets/images/background" + i + ".png";
    backgrounds.push(img);
  }

  const images = {};
  const imageList = [
    "player", "gem", "trap", "shop", "shield", "health", "teleport", "bomb", "dead", "exit"
  ];
  imageList.forEach(name => {
    images[name] = new Image();
    images[name].src = "../assets/images/" + name + ".png";
  });

  let level = 1;
  let player = { x: 1, y: 1, gems: 0, health: 10, shield: 0 };
  let inventory = [];
  let map = [];
  let teleportMode = false;
  let shopOpen = false;
  let deathScreen = false;

  function generateMap() {
    map = Array.from({ length: rows }, () => Array(cols).fill("."));
    player.x = 1; player.y = 1;
    map[player.y][player.x] = "P";

    let ex, ey;
    do {
      ex = Math.floor(Math.random() * cols);
      ey = Math.floor(Math.random() * rows);
    } while ((ex === player.x && ey === player.y));
    map[ey][ex] = "X";

    let sx, sy;
    do {
      sx = Math.floor(Math.random() * cols);
      sy = Math.floor(Math.random() * rows);
    } while ((sx === player.x && sy === player.y) || (sx === ex && sy === ey));
    map[sy][sx] = "S";

    let trapCount = Math.min(5 + level * 2, Math.floor(rows * cols / 6));
    let gemCount = Math.max(10 - level, 2);
    placeRandom("T", trapCount, [ [player.x, player.y], [ex, ey], [sx, sy] ]);
    placeRandom("G", gemCount, [ [player.x, player.y], [ex, ey], [sx, sy] ]);
  }
  function placeRandom(symbol, count, avoid=[]) {
    let placed = 0;
    while (placed < count) {
      const x = Math.floor(Math.random() * cols);
      const y = Math.floor(Math.random() * rows);
      let forbidden = avoid.some(([ax, ay]) => ax === x && ay === y);
      if (!forbidden && map[y][x] === ".") {
        map[y][x] = symbol;
        placed++;
      }
    }
  }

  function drawMap() {
    // Draw background
    const bgIndex = ((level - 1) % 10);
    ctx.drawImage(backgrounds[bgIndex], 0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const tile = map[y][x];
        if (tile === "P" && !deathScreen) ctx.drawImage(images.player, x * tileSize, y * tileSize, tileSize, tileSize);
        else if (tile === "G") ctx.drawImage(images.gem, x * tileSize, y * tileSize, tileSize, tileSize);
        else if (tile === "T") ctx.drawImage(images.trap, x * tileSize, y * tileSize, tileSize, tileSize);
        else if (tile === "S") ctx.drawImage(images.shop, x * tileSize, y * tileSize, tileSize, tileSize);
        else if (tile === "X") ctx.drawImage(images.exit, x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }

    if (teleportMode) {
      for (let y = 0; y < rows; ++y) for (let x = 0; x < cols; ++x) {
        let dist = Math.abs(player.x - x) + Math.abs(player.y - y);
        if (map[y][x] !== "T" && map[y][x] !== "G" && map[y][x] !== "." && map[y][x] !== "X") continue;
        ctx.fillStyle = dist <= 6 ? "rgba(0,255,0,0.25)" : "rgba(255,0,0,0.18)";
        ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
      }
    }
  }

  function drawStats() {
    document.getElementById("stats").innerHTML =
      `<b>Level:</b> ${level} &nbsp; <b>Gems:</b> ${player.gems} &nbsp; <b>Health:</b> ${player.health} &nbsp; <b>Shield:</b> ${player.shield}`;
  }

  function drawInventory() {
    const inv = document.getElementById("inventory");
    inv.innerHTML = "Inventory: ";
    inventory.forEach((item, idx) => {
      const img = document.createElement("img");
      img.src = "../assets/images/" + item + ".png";
      img.alt = item;
      img.className = "inv-item";
      img.title = item.charAt(0).toUpperCase() + item.slice(1);
      img.onclick = () => useItem(idx);
      inv.appendChild(img);
    });
    if (inventory.length === 0) inv.innerHTML += "<span style='color:#888'>empty</span>";
  }

  function openShop() {
    shopOpen = true;
    const shopDiv = document.getElementById("shop");
    shopDiv.innerHTML = "<h3>Shop</h3>";
    shopDiv.style.display = "block";
    const offers = [];
    if (level >= 1) offers.push({ item: "shield", cost: 1 });
    if (level >= 2) offers.push({ item: "health", cost: 2 });
    if (level >= 3) offers.push({ item: "teleport", cost: 3 });
    if (level >= 4) offers.push({ item: "bomb", cost: 10 });
    offers.forEach(({ item, cost }) => {
      const btn = document.createElement("button");
      btn.innerHTML = `<img src='../assets/images/${item}.png' width='32'> ${item} (${cost}G)`;
      btn.onclick = () => {
        if (player.gems >= cost) {
          player.gems -= cost;
          inventory.push(item);
          drawStats();
          drawInventory();
        }
      };
      shopDiv.appendChild(btn);
    });
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    closeBtn.onclick = () => (shopDiv.style.display = "none", shopOpen = false);
    shopDiv.appendChild(closeBtn);
  }


  function useItem(idx) {
    const item = inventory[idx];
    inventory.splice(idx, 1);
    if (item === "shield") player.shield += 2;
    else if (item === "health") player.health += 5;
    else if (item === "teleport") teleportMode = true;
    else if (item === "bomb") {
      for (let y=0; y<rows; ++y) for (let x=0; x<cols; ++x)
        if (map[y][x] === "T") map[y][x] = ".";
    }
    drawStats(); drawInventory(); drawMap();
  }


  function move(dx, dy) {
    if (shopOpen || deathScreen || teleportMode) return;
    let nx = player.x + dx, ny = player.y + dy;
    if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) return; // Prevent moving off the map!
    let tile = map[ny][nx];
    if (tile === "S") return openShop();
    if (tile === "T") {
      if (player.shield > 0) player.shield--;
      else if (player.gems > 0) player.gems--;
      else player.health--;
      if (player.health <= 0) return gameOver();
    }
    if (tile === "G") player.gems++;
    if (tile === "X") { level++; generateMap(); }
    map[player.y][player.x] = ".";
    player.x = nx; player.y = ny;
    map[player.y][player.x] = "P";
    drawStats(); drawInventory(); drawMap();
  }


  canvas.addEventListener("click", function(e) {
    if (!teleportMode || shopOpen || deathScreen) return;
    const rect = canvas.getBoundingClientRect();
    const mx = Math.floor((e.clientX - rect.left) / tileSize);
    const my = Math.floor((e.clientY - rect.top) / tileSize);
    if (mx < 0 || my < 0 || mx >= cols || my >= rows) return;
    const dist = Math.abs(mx - player.x) + Math.abs(my - player.y);
    if (dist <= 6 && map[my] && map[my][mx]) {
      if (map[my][mx] === "T") {
        if (player.shield > 0) player.shield--;
        else if (player.gems > 0) player.gems--;
        else player.health--;
        if (player.health <= 0) return gameOver();
      }
      map[player.y][player.x] = ".";
      player.x = mx; player.y = my;
      map[player.y][player.x] = "P";
      teleportMode = false;
      drawStats(); drawInventory(); drawMap();
    }
  });


  function gameOver() {
    deathScreen = true;
    const overlay = document.getElementById("death-overlay");
    overlay.innerHTML = `<img src="../assets/images/dead.png" alt="Dead"><h2>You Died!</h2>
      <div style="margin-bottom:10px;">Press <b>R</b> to restart</div>`;
    overlay.style.display = "block";
  }
  function hideDeath() {
    deathScreen = false;
    document.getElementById("death-overlay").style.display = "none";
  }


  document.addEventListener("keydown", (e) => {
    if (shopOpen || deathScreen) {
      if (deathScreen && e.key.toLowerCase() === "r") {
        level = 1;
        player = { x: 1, y: 1, gems: 0, health: 10, shield: 0 };
        inventory = [];
        hideDeath();
        generateMap();
        drawStats(); drawInventory(); drawMap();
      }
      return;
    }
    if (teleportMode) return;
    if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") move(0, -1);
    if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") move(0, 1);
    if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") move(-1, 0);
    if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") move(1, 0);
  });


  generateMap();
  drawStats();
  drawInventory();
  drawMap();
};
