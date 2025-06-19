const root = document.getElementById('game-root');

const CLASSES = [
  'rogue', 'mage', 'warrior', 'paladin', 'thief', 'knight', 'villager', 'reviewer'
];
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
  { name: "armor", label: "Armor", cost: 2, bonus: { hp: 5, attack: 0 } },
  { name: "helmet", label: "Helmet", cost: 2, bonus: { hp: 5, attack: 0 } },
  { name: "necklace", label: "Necklace", cost: 2, bonus: { hp: 5, attack: 0 } },
  { name: "rizz", label: "Rizz", cost: 10, bonus: { hp: 0, attack: 10 } }
];

let player = {
  class: null,
  sex: null,
  hp: 15,
  maxHp: 15,
  attack: 2,
  gold: 10,
  level: 1,
  inventory: [],
  completedQuest: false
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
      document.getElementById('charPreview').innerHTML =
        `<img src="../assets/images/${selectedSex}${selectedClass}.png" alt="Character" />`;
      document.getElementById('continueBtnContainer').innerHTML =
        `<button class="button" id="continueBtn" style="float:right;">Continue</button>`;
      document.getElementById('continueBtn').onclick = () => {
        player.class = selectedClass;
        player.sex = selectedSex;
        showWelcomeScreen();
      };
    }
  }

  document.querySelectorAll('.class-btn').forEach(btn => {
    btn.onclick = () => {
      selectedClass = btn.dataset.class;
      updatePreview();
    };
  });
  document.querySelectorAll('.sex-btn').forEach(btn => {
    btn.onclick = () => {
      selectedSex = btn.dataset.sex;
      updatePreview();
    };
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
          Choose your path and begin your journey!
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
      <img src="../assets/images/${player.sex}${player.class}.png" alt="Character" />
    </div>
    <div style="position:absolute; left:40px; top:40px;">
      <img src="../assets/images/hpbar.png" style="width:180px;" alt="HP Bar" />
      <div style="position:absolute; left:60px; top:18px; color:#fff; font-size:1.2em;">
        ${player.hp}/${player.maxHp}
      </div>
      <div style="margin-top: 30px; color:#fff;">Attack: ${player.attack}</div>
      <div style="margin-top: 10px; color:#fff;">Gold: ${player.gold}</div>
      <div style="margin-top: 10px; color:#fff;">Level: ${player.level}</div>
    </div>
    <div style="position:absolute; left:40px; top:140px;">
      <div style="color:#fff; font-size:1.1em;">Inventory:</div>
      <div id="inventoryIcons" style="display:flex; gap:8px; margin-top:6px;">
        ${player.inventory.map(item => `<img src="../assets/images/${item}.png" style="width:32px;" alt="${item}" />`).join('')}
      </div>
    </div>
  `;
}

function showMapScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/map.png" class="bg-img" alt="Map" />
      <div style="position:relative; width:100%; height:100%;">
        <div style="position:absolute; left:120px; top:120px;">
          <img src="../assets/images/bar.png" class="location" id="barLoc" style="width:120px;cursor:pointer;" alt="Bar" />
        </div>
        <div style="position:absolute; left:320px; top:220px;">
          <img src="../assets/images/inn.png" class="location" id="innLoc" style="width:120px;cursor:pointer;" alt="Inn" />
        </div>
        <div style="position:absolute; left:520px; top:180px;">
          <img src="../assets/images/guild.png" class="location" id="guildLoc" style="width:120px;cursor:pointer;" alt="Guild" />
        </div>
        <div style="position:absolute; left:700px; top:320px;">
          <img src="../assets/images/blacksmith.png" class="location" id="blacksmithLoc" style="width:120px;cursor:pointer;" alt="Blacksmith" />
        </div>
        <div id="goThereBtnContainer"></div>
      </div>
      ${showPlayerPanel()}
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
  document.getElementById('goBtn').onclick = callback;
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
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('stayBtn').onclick = () => {
    if (player.gold < 1) { alert("Not enough gold!"); return; }
    player.gold -= 1;
    player.hp = player.maxHp;
    root.innerHTML = `
      <div class="screen">
        <img src="../assets/images/sleeping.png" class="bg-img" alt="Sleeping" />
        <div class="bubble">
          <div>You have rested and fully recovered!</div>
          <button class="button" id="wakeBtn">Wake up</button>
        </div>
        ${showPlayerPanel()}
      </div>
    `;
    document.getElementById('wakeBtn').onclick = showMapScreen;
  };
  document.getElementById('eatBtn').onclick = () => {
    if (player.gold < 1) { alert("Not enough gold!"); return; }
    player.gold -= 1;
    root.innerHTML = `
      <div class="screen">
        <img src="../assets/images/eating.png" class="bg-img" alt="Eating" />
        <div class="bubble">
          <div>You ate a hearty meal.</div>
          <button class="button" id="outBtn">Go out</button>
        </div>
        ${showPlayerPanel()}
      </div>
    `;
    document.getElementById('outBtn').onclick = showMapScreen;
  };
  document.getElementById('backBtn').onclick = showMapScreen;
}

// --- Bar ---
function showBarScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/barkeeper.png" class="bg-img" alt="Bar" />
      <div class="bubble">
        <div>What would you like?</div>
        <button class="button" id="aleBtn">Drink ale (1 gold)</button>
        <button class="button" id="wineBtn">Drink wine (1 gold)</button>
        <button class="button" id="whiskyBtn">Drink whisky (1 gold)</button>
        <button class="button" id="milkBtn">Drink milk (1 gold)</button>
        <button class="button" id="rizzBtn">Rizz the bar lady</button>
        <button class="button" id="backBtn">Back to Map</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  function drink(type) {
    if (player.gold < 1) { alert("Not enough gold!"); return; }
    player.gold -= 1;
    root.innerHTML = `
      <div class="screen">
        <img src="../assets/images/drink${type}.png" class="bg-img" alt="Drink" />
        <div class="bubble">
          <div>You drank ${type}.</div>
          <button class="button" id="getOutBtn">Get out</button>
        </div>
        ${showPlayerPanel()}
      </div>
    `;
    document.getElementById('getOutBtn').onclick = showMapScreen;
  }
  document.getElementById('aleBtn').onclick = () => drink("ale");
  document.getElementById('wineBtn').onclick = () => drink("wine");
  document.getElementById('whiskyBtn').onclick = () => drink("whisky");
  document.getElementById('milkBtn').onclick = () => drink("milk");
  document.getElementById('rizzBtn').onclick = showBarRizzScreen;
  document.getElementById('backBtn').onclick = showMapScreen;
}

function showBarRizzScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/rizzbar.png" class="bg-img" alt="Rizz Bar Lady" />
      <div class="bubble">
        <div>What do you say?</div>
        <button class="button" id="hiBtn">Hi you are beautiful</button>
        <button class="button" id="goOutBtn">Wanna go out</button>
        <button class="button" id="buyDrinkBtn">Wanna buy you a drink</button>
        <button class="button" id="comeBtn">Wanna come home</button>
        <button class="button" id="backBtn">Back</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('hiBtn').onclick = () => showBarRizzResult("hi");
  document.getElementById('goOutBtn').onclick = () => showBarRizzResult("gout");
  document.getElementById('buyDrinkBtn').onclick = () => showBarRizzResult("buydrink");
  document.getElementById('comeBtn').onclick = () => showBarRizzResult("come");
  document.getElementById('backBtn').onclick = showBarScreen;
}

function showBarRizzResult(type) {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/${type}.png" class="bg-img" alt="Rizz Result" />
      <div class="bubble">
        <div>Well, that was interesting.</div>
        <button class="button" id="backBtn">Back to Bar</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('backBtn').onclick = showBarScreen;
}

// --- Guild ---
function showGuildScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/guildkeeper.png" class="bg-img" alt="Guild" />
      <div class="bubble">
        <div>What would you like?</div>
        <button class="button" id="questBoardBtn">Look at the quest board</button>
        <button class="button" id="completeQuestBtn">Complete quest</button>
        <button class="button" id="rizzBtn">Rizz the guild keeper</button>
        <button class="button" id="backBtn">Back to Map</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('questBoardBtn').onclick = showQuestBoard;
  document.getElementById('completeQuestBtn').onclick = () => {
    if (player.completedQuest) {
      player.gold += 10;
      player.completedQuest = false;
      alert("You received 10 gold!");
    } else {
      alert("No completed quest!");
    }
    showGuildScreen();
  };
  document.getElementById('rizzBtn').onclick = showGuildRizzScreen;
  document.getElementById('backBtn').onclick = showMapScreen;
}

function showGuildRizzScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/rizzbar.png" class="bg-img" alt="Rizz Guild Keeper" />
      <div class="bubble">
        <div>What do you say?</div>
        <button class="button" id="hiBtn">Hi you are beautiful</button>
        <button class="button" id="goOutBtn">Wanna go out</button>
        <button class="button" id="buyDrinkBtn">Wanna buy you a drink</button>
        <button class="button" id="comeBtn">Wanna come home</button>
        <button class="button" id="backBtn">Back</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('hiBtn').onclick = () => showGuildRizzResult("hi");
  document.getElementById('goOutBtn').onclick = () => showGuildRizzResult("gout");
  document.getElementById('buyDrinkBtn').onclick = () => showGuildRizzResult("buydrink");
  document.getElementById('comeBtn').onclick = () => showGuildRizzResult("come");
  document.getElementById('backBtn').onclick = showGuildScreen;
}

function showGuildRizzResult(type) {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/${type}.png" class="bg-img" alt="Rizz Result" />
      <div class="bubble">
        <div>Well, that was interesting.</div>
        <button class="button" id="backBtn">Back to Guild</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('backBtn').onclick = showGuildScreen;
}

function showQuestBoard() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/quest.png" class="bg-img" alt="Quest Board" />
      <div class="bubble">
        <div>Choose a quest:</div>
        ${QUESTS.map((q, i) => `<div><img src="../assets/images/${q.img}" style="width:80px;vertical-align:middle;"> <button class="button" onclick="window._startQuest(${i})">${q.name}</button></div>`).join('')}
        <button class="button" id="exitBtn">Exit</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  window._startQuest = startQuest;
  document.getElementById('exitBtn').onclick = showGuildScreen;
}

function startQuest(idx) {
  showFightScreen(QUESTS[idx]);
}

function showFightScreen(quest) {
  // Reset player HP for the fight
  player.hp = player.maxHp;
  let monster = { ...quest.monster, curHp: quest.monster.hp };
  let playerDefend = false, monsterDefend = false;

  function render() {
    root.innerHTML = `
      <div class="screen">
        <img src="../assets/images/${quest.fight}" class="bg-img" alt="Fight" />
        <div class="bubble">
          <div>Fighting: ${monster.name}</div>
          <div>Monster HP: ${monster.curHp} / ${monster.hp}</div>
          <div>Your HP: ${player.hp} / ${player.maxHp}</div>
          <button class="button" id="attackBtn">Attack</button>
          <button class="button" id="defendBtn">Defend</button>
          <button class="button" id="runBtn">Run</button>
          <div id="fightMsg"></div>
        </div>
        ${showPlayerPanel()}
      </div>
    `;
    document.getElementById('attackBtn').onclick = () => fightTurn('attack');
    document.getElementById('defendBtn').onclick = () => fightTurn('defend');
    document.getElementById('runBtn').onclick = showQuestBoard;
  }

  function fightTurn(action) {
    let msg = "";
    // Player's turn
    if (action === 'attack') {
      const roll = Math.ceil(Math.random() * 6);
      msg += `You rolled a ${roll}. `;
      if (roll >= 4) {
        let dmg = player.attack;
        if (monsterDefend) { dmg = 0; msg += "Monster blocked your attack! "; }
        else { monster.curHp -= dmg; msg += `You hit for ${dmg} damage! `; }
      } else {
        msg += "You missed! ";
      }
      monsterDefend = false;
    } else if (action === 'defend') {
      const roll = Math.ceil(Math.random() * 6);
      msg += `You rolled a ${roll}. `;
      if (roll >= 4) {
        playerDefend = true;
        msg += "You will block the next attack!";
      } else {
        msg += "You failed to defend!";
        playerDefend = false;
      }
    }
    // Check if monster defeated
    if (monster.curHp <= 0) {
      player.level = Math.min(player.level + 1, 5);
      player.completedQuest = true;
      alert(`You defeated the ${monster.name}! You leveled up!`);
      showQuestBoard();
      return;
    }
    // Monster's turn
    setTimeout(() => {
      let mmsg = "";
      const roll = Math.ceil(Math.random() * 6);
      mmsg += `Monster rolled a ${roll}. `;
      if (roll >= 4) {
        let dmg = monster.attack;
        if (playerDefend) { dmg = 0; mmsg += "You blocked the attack! "; }
        else { player.hp -= dmg; mmsg += `Monster hits for ${dmg} damage! `; }
      } else {
        mmsg += "Monster missed! ";
      }
      playerDefend = false;
      if (player.hp <= 0) {
        alert("You have been defeated!");
        showMapScreen();
        return;
      }
      render();
      document.getElementById('fightMsg').textContent = msg + " " + mmsg;
    }, 700);
  }
  render();
}

// --- Blacksmith ---
function showBlacksmithScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/blackkeeper.png" class="bg-img" alt="Blacksmith" />
      <div class="bubble">
        <div>What would you like?</div>
        <button class="button" id="purchaseBtn">Purchase equipment</button>
        <button class="button" id="rizzBtn">Rizz the blacksmith daughter</button>
        <button class="button" id="backBtn">Back to Map</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('purchaseBtn').onclick = showBlacksmithShop;
  document.getElementById('rizzBtn').onclick = showBlacksmithRizzScreen;
  document.getElementById('backBtn').onclick = showMapScreen;
}

function showBlacksmithShop() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/blackkeeper.png" class="bg-img" alt="Shop" />
      <div class="bubble">
        <div>Available equipment:</div>
        ${EQUIPMENT.map(eq => `
          <div>
            <img src="../assets/images/${eq.name}.png" style="width:40px;vertical-align:middle;">
            ${eq.label} (${eq.cost} gold)
            <button class="button" onclick="window._buyEq('${eq.name}')">Buy</button>
          </div>
        `).join('')}
        <button class="button" id="backBtn">Back</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  window._buyEq = (name) => {
    const eq = EQUIPMENT.find(e => e.name === name);
    if (!eq) return;
    if (player.gold < eq.cost) { alert("Not enough gold!"); return; }
    if (player.inventory.includes(eq.name)) { alert("Already owned!"); return; }
    player.gold -= eq.cost;
    player.inventory.push(eq.name);
    alert(`You bought ${eq.label}!`);
    showBlacksmithShop();
  };
  document.getElementById('backBtn').onclick = showBlacksmithScreen;
}

function showBlacksmithRizzScreen() {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/rizzbar.png" class="bg-img" alt="Rizz Blacksmith Daughter" />
      <div class="bubble">
        <div>What do you say?</div>
        <button class="button" id="hiBtn">Hi you are beautiful</button>
        <button class="button" id="goOutBtn">Wanna go out</button>
        <button class="button" id="buyDrinkBtn">Wanna buy you a drink</button>
        <button class="button" id="comeBtn">Wanna come home</button>
        <button class="button" id="backBtn">Back</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('hiBtn').onclick = () => showBlacksmithRizzResult("hi");
  document.getElementById('goOutBtn').onclick = () => showBlacksmithRizzResult("gout");
  document.getElementById('buyDrinkBtn').onclick = () => showBlacksmithRizzResult("buydrink");
  document.getElementById('comeBtn').onclick = () => showBlacksmithRizzResult("come");
  document.getElementById('backBtn').onclick = showBlacksmithScreen;
}

function showBlacksmithRizzResult(type) {
  root.innerHTML = `
    <div class="screen">
      <img src="../assets/images/${type}.png" class="bg-img" alt="Rizz Result" />
      <div class="bubble">
        <div>Well, that was interesting.</div>
        <button class="button" id="backBtn">Back to Blacksmith</button>
      </div>
      ${showPlayerPanel()}
    </div>
  `;
  document.getElementById('backBtn').onclick = showBlacksmithScreen;
}

// --- Start game ---
showPlayScreen();
