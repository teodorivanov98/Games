const root = document.getElementById('game-root');
const CLASSES = [ 'rogue', 'mage', 'warrior', 'paladin', 'thief', 'knight', 'villager', 'reviewer' ];
const SEXES = ['male', 'female'];
const QUESTS = [
  { name: "Goblin", img: "quest1.png", fight: "goblinfight.png", monster: { name: "Goblin", hp: 10, attack: 1 } },
  { name: "Kobold", img: "quest2.png", fight: "koboldfight.png", monster: { name: "Kobold", hp: 12, attack: 2 } },
  { name: "Shapeshifter", img: "quest3.png", fight: "shapeshifterfight.png", monster: { name: "Shapeshifter", hp: 14, attack: 3 } },
  { name: "Kapa", img: "quest4.png", fight: "kapafight.png", monster: { name: "Kapa", hp: 18, attack: 4 } },
  { name: "Dragon", img: "quest5.png", fight: "dragonfight.png", monster: { name: "Dragon", hp: 25, attack: 7 } }
];
const EQUIPMENT = [
  { name: "cocshield", label: "Shield", cost: 2, bonus: { hp: 0, attack: 0 } },
  { name: "sword", label: "Sword", cost: 2, bonus: { hp: 0, attack: 2 } },
  { name: "staff", label: "Staff", cost: 2, bonus: { hp: 0, attack: 2 } },
  { name: "dagger", label: "Dagger", cost: 2, bonus: { hp: 0, attack: 2 } },
  { name: "armour", label: "armour", cost: 2, bonus: { hp: 5, attack: 0 } },
  { name: "helmet", label: "Helmet", cost: 2, bonus: { hp: 5, attack: 0 } },
  { name: "necklace", label: "Necklace", cost: 2, bonus: { hp: 5, attack: 0 } },
  { name: "rizz", label: "Rizz", cost: 10, bonus: { hp: 0, attack: 10 } }
];
let player = {
  class: null, sex: null, hp: 15, maxHp: 15, attack: 2,
  gold: 10, level: 1, inventory: [], completedQuest: false
};

function updateStatsByLevel() {
  switch (player.level) {
    case 1: player.maxHp = 15; player.attack = 2; break;
    case 2: player.maxHp = 20; player.attack = 4; break;
    case 3: player.maxHp = 25; player.attack = 6; break;
    case 4: player.maxHp = 30; player.attack = 8; break;
    case 5: player.maxHp = 40; player.attack = 10; break;
    default: player.maxHp = 15; player.attack = 2;
  }
  // Add equipment bonuses
  let hpBonus = 0, atkBonus = 0;
  for (const item of player.inventory) {
    const eq = EQUIPMENT.find(e => e.name === item);
    if (eq) {
      hpBonus += eq.bonus.hp;
      atkBonus += eq.bonus.attack;
    }
  }
  player.maxHp += hpBonus;
  player.attack += atkBonus;
  if (player.hp > player.maxHp) player.hp = player.maxHp;
}

function showPlayScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/load.png" class="bg-img" alt="Load Game" />
      <button class="button centered" id="playBtn">Play</button>
    </div>
  `;
  document.getElementById('playBtn').onclick = showCustomizeScreen;
}

function showCustomizeScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/customize.png" class="bg-img" alt="Customize" />
      <div class="bubble" style="margin-top: 80px;">
        <h2>Customize your character</h2>
        <div class="customize-options">
          <div class="option-group">
            <label>Class:</label>
            ${CLASSES.map(cls => `<button class="button class-btn" data-class="${cls}">${cls.charAt(0).toUpperCase() + cls.slice(1)}</button>`).join('')}
          </div>
          <div class="option-group">
            <label>Sex:</label>
            ${SEXES.map(sex => `<button class="button sex-btn" data-sex="${sex}">${sex.charAt(0).toUpperCase() + sex.slice(1)}</button>`).join('')}
          </div>
        </div>
        <div id="continueBtnContainer"></div>
      </div>
      <div class="character-preview" id="charPreview"></div>
    </div>
  `;
  let selectedClass = null;
  let selectedSex = null;
  function updatePreview() {
    if (selectedClass && selectedSex) {
      document.getElementById('charPreview').innerHTML = `<img src="../assets/images/${selectedSex}${selectedClass}.png" alt="Character" />`;
      document.getElementById('continueBtnContainer').innerHTML = `<button class="button" id="continueBtn" style="float:right;">Continue</button>`;
      document.getElementById('continueBtn').onclick = () => {
        player.class = selectedClass;
        player.sex = selectedSex;
        showWelcomeScreen();
      };
    }
  }
  document.querySelectorAll('.class-btn').forEach(btn => {
    btn.onclick = () => { selectedClass = btn.dataset.class; updatePreview(); };
  });
  document.querySelectorAll('.sex-btn').forEach(btn => {
    btn.onclick = () => { selectedSex = btn.dataset.sex; updatePreview(); };
  });
}

function showWelcomeScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/welcome.png" class="bg-img" alt="Welcome" />
      <div class="bubble" style="margin-top: 80px;">
        <h2>Welcome to Call of Cthulu</h2>
        <p>
          Welcome, brave adventurer! The world is full of dangers and mysteries.<br>
          Choose your path and begin your journey!...
        </p>
        <button class="button" id="toMapBtn">Continue</button>
      </div>
    </div>
  `;
  document.getElementById('toMapBtn').onclick = showMapScreen;
}

function showPlayerPanel() {
  updateStatsByLevel();
  return `
    <div class="character-preview" id="charPreview">
      <img src="../assets/images/${player.sex ?? "male"}${player.class ?? "rogue"}.png" alt="Character" />
      <div style="color:#fff;">Gold: ${player.gold}</div>
      <div style="color:#fff;">Level: ${player.level}</div>
      <div style="margin-top:10px; color:#fff;">Inventory:</div>
      <div id="inventoryIcons" style="display:flex; gap:8px; margin-top:6px; justify-content:center;">
        ${player.inventory.map(item => `<img src="../assets/images/${item}.png" alt="${item}" />`).join('')}
      </div>
    </div>
  `;
}
function showPlayerStatsBar() {
  updateStatsByLevel();
  return `
    <div class="player-stats-bar">
      <img src="../assets/images/hpbar.png" class="hp-bar-img" alt="HP Bar" />
      <div class="hp-text">${player.hp}/${player.maxHp} HP</div>
      <div class="atk-text">Attack: ${player.attack}</div>
    </div>
  `;
}

function showMapScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/map.png" class="bg-img" alt="Map" />
      <div class="map-grid">
        <img src="../assets/images/bar.png" class="location" id="barLoc" alt="Bar" />
        <img src="../assets/images/inn.png" class="location" id="innLoc" alt="Inn" />
        <img src="../assets/images/guild.png" class="location" id="guildLoc" alt="Guild" />
        <img src="../assets/images/blacksmith.png" class="location" id="blacksmithLoc" alt="Blacksmith" />
      </div>
      <div id="goThereBtnContainer"></div>
      <div class="player-panel-container">
        ${showPlayerStatsBar()}
        ${showPlayerPanel()}
      </div>
    </div>
  `;
  [
    {id: 'barLoc', fn: () => showLocationPrompt('Bar', showBarScreen)},
    {id: 'innLoc', fn: () => showLocationPrompt('Inn', showInnScreen)},
    {id: 'guildLoc', fn: () => showLocationPrompt('Guild', showGuildScreen)},
    {id: 'blacksmithLoc', fn: () => showLocationPrompt('Blacksmith', showBlacksmithScreen)}
  ].forEach(loc => {
    const el = document.getElementById(loc.id);
    if (el) el.onclick = loc.fn;
  });
}

function showLocationPrompt(name, callback) {
  const btnDiv = document.getElementById('goThereBtnContainer');
  btnDiv.innerHTML = `<button class="button" id="goBtn">Go to ${name}</button>`;
  document.getElementById('goBtn').onclick = function() {
    btnDiv.innerHTML = "";
    callback();
  };
}

// --- Inn ---
function showInnScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/innkeeper.png" class="bg-img" alt="Inn" />
      <div class="bubble">
        <div>What would you like?</div>
        <button class="button" id="stayBtn">Stay at the inn (1 gold)</button>
        <button class="button" id="eatBtn">Eat (1 gold)</button>
        <button class="button" id="backBtn">Back to Map</button>
      </div>
      <div class="player-panel-container">
        ${showPlayerStatsBar()}
        ${showPlayerPanel()}
      </div>
    </div>
  `;
  document.getElementById('backBtn').onclick = showMapScreen;
}

// --- Bar ---
function showBarScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/barkeeper.png" class="bg-img" alt="Bar" />
      <div class="bubble">
        <div>What would you like?</div>
        <button class="button" id="backBtn">Back to Map</button>
      </div>
      <div class="player-panel-container">
        ${showPlayerStatsBar()}
        ${showPlayerPanel()}
      </div>
    </div>
  `;
  document.getElementById('backBtn').onclick = showMapScreen;
}

// --- Guild ---
function showGuildScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/guildkeeper.png" class="bg-img" alt="Guild" />
      <div class="bubble">
        <div>What would you like?</div>
        <button class="button" id="backBtn">Back to Map</button>
      </div>
      <div class="player-panel-container">
        ${showPlayerStatsBar()}
        ${showPlayerPanel()}
      </div>
    </div>
  `;
  document.getElementById('backBtn').onclick = showMapScreen;
}

// --- Blacksmith ---
function showBlacksmithScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/blacksmithkeeper.png" class="bg-img" alt="Blacksmith" />
      <div class="bubble">
        <div>Welcome to the Blacksmith!</div>
        <button class="button" id="backBtn">Back to Map</button>
      </div>
      <div class="player-panel-container">
        ${showPlayerStatsBar()}
        ${showPlayerPanel()}
      </div>
    </div>
  `;
  document.getElementById('backBtn').onclick = showMapScreen;
}

// Start the game at the play screen
showPlayScreen();
