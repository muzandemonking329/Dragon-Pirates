// ============================================================
// DRAGON PIRATES
// Main Game Engine
// ============================================================

const DATA = window.DragonPiratesData;

if (!DATA) {
    alert("Dragon Pirates data could not be loaded. Make sure game-data.js is above game.js in index.html.");
    throw new Error("DragonPiratesData is missing.");
}

// ============================================================
// GAME STATE
// ============================================================

const game = {
    started: false,

    captain: {
        name: "Captain Skyla",
        level: 1,
        health: 100,
        maxHealth: 100,
        gold: 500
    },

    dragon: null,

    ship: {
        x: 50,
        y: 50,
        health: 100,
        maxHealth: 100,
        speed: 5
    },

    inventory: [],

    quests: [],

    defeatedEnemies: 0,

    discoveredIslands: [],

    upgrades: {
        reinforcedHull: false,
        dragonSaddle: false,
        treasureCompass: false,
        ancientMap: false
    },

    currentEnemy: null,

    battleEnemyHealth: 0,

    message: "Welcome to the Dragon Pirates!",

    keys: {
        w: false,
        a: false,
        s: false,
        d: false
    }
};

// ============================================================
// DOM HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}

function setText(id, value) {
    const element = $(id);

    if (element) {
        element.textContent = value;
    }
}

function show(id) {
    const element = $(id);

    if (element) {
        element.style.display = "";
    }
}

function hide(id) {
    const element = $(id);

    if (element) {
        element.style.display = "none";
    }
}

// ============================================================
// SAVE SYSTEM
// ============================================================

function saveGame() {
    localStorage.setItem(
        "dragonPiratesSave",
        JSON.stringify(game)
    );

    setMessage("💾 Game saved!");
}

function loadGame() {
    const saved = localStorage.getItem("dragonPiratesSave");

    if (!saved) {
        return false;
    }

    try {
        const loaded = JSON.parse(saved);

        Object.assign(game, loaded);

        if (!game.keys) {
            game.keys = {
                w: false,
                a: false,
                s: false,
                d: false
            };
        }

        return true;

    } catch (error) {
        console.error("Save file could not be loaded.", error);
        return false;
    }
}

// ============================================================
// MESSAGE SYSTEM
// ============================================================

function setMessage(message) {
    game.message = message;

    const possibleBoxes = [
        "message",
        "gameMessage",
        "statusMessage",
        "log"
    ];

    for (const id of possibleBoxes) {
        const element = $(id);

        if (element) {
            element.textContent = message;
            break;
        }
    }
}

// ============================================================
// DRAGON SYSTEM
// ============================================================

function chooseDragon(dragonId) {
    const dragon = DATA.dragons[dragonId];

    if (!dragon) {
        console.error("Dragon not found:", dragonId);
        return;
    }

    game.dragon = {
        id: dragonId,
        name: dragonId,
        type: dragon.type,
        emoji: dragon.emoji,
        power: dragon.power,
        speed: dragon.speed,
        health: dragon.health,
        maxHealth: dragon.health,
        special: dragon.special,
        rank: 10,
        experience: 0
    };

    game.started = true;

    setMessage(
        `${dragon.emoji} ${dragonId} has joined your crew!`
    );

    updateUI();

    hideTitleScreen();
    showGameScreen();

    saveGame();
}

function chooseDragonFromButton(button) {
    const dragonId =
        button.dataset.dragon ||
        button.getAttribute("data-dragon");

    if (dragonId) {
        chooseDragon(dragonId);
    }
}

function getDragonRankData() {
    if (!game.dragon) {
        return DATA.dragonRanks[10];
    }

    return DATA.dragonRanks[game.dragon.rank] ||
           DATA.dragonRanks[10];
}

// ============================================================
// DRAGON EXPERIENCE
// ============================================================

function giveDragonExperience(amount) {
    if (!game.dragon) {
        return;
    }

    game.dragon.experience += amount;

    while (
        game.dragon.rank > 1 &&
        game.dragon.experience >= 100
    ) {
        game.dragon.experience -= 100;
        game.dragon.rank--;

        const rankData =
            DATA.dragonRanks[game.dragon.rank];

        setMessage(
            `🐉 YOUR DRAGON RANKED UP! ${rankData.name}`
        );
    }

    updateUI();
}

// ============================================================
// SHIP SYSTEM
// ============================================================

function moveShip(dx, dy) {
    if (!game.started) {
        return;
    }

    const speed =
        game.upgrades.dragonSaddle
            ? game.ship.speed + 2
            : game.ship.speed;

    game.ship.x += dx * speed;
    game.ship.y += dy * speed;

    game.ship.x = Math.max(
        3,
        Math.min(97, game.ship.x)
    );

    game.ship.y = Math.max(
        3,
        Math.min(97, game.ship.y)
    );

    updateShipPosition();
    checkIslandProximity();
}

function updateShipPosition() {
    const ship =
        $("playerShip") ||
        $("ship") ||
        $("player");

    if (!ship) {
        return;
    }

    ship.style.left = `${game.ship.x}%`;
    ship.style.top = `${game.ship.y}%`;
}

function checkIslandProximity() {
    for (const island of DATA.islands) {
        const distance = Math.sqrt(
            Math.pow(game.ship.x - island.x, 2) +
            Math.pow(game.ship.y - island.y, 2)
        );

        if (distance < 8) {
            discoverIsland(island);
        }
    }
}

// ============================================================
// ISLAND SYSTEM
// ============================================================

function discoverIsland(island) {
    if (
        !game.discoveredIslands.includes(island.id)
    ) {
        game.discoveredIslands.push(island.id);

        setMessage(
            `${island.emoji} Discovered ${island.name}!`
        );

        updateUI();
        saveGame();
    }
}

function exploreIsland() {
    if (!game.started) {
        return;
    }

    const nearby = DATA.islands.find(island => {
        const distance = Math.sqrt(
            Math.pow(game.ship.x - island.x, 2) +
            Math.pow(game.ship.y - island.y, 2)
        );

        return distance < 12;
    });

    if (!nearby) {
        setMessage(
            "🧭 Sail closer to an island before exploring."
        );
        return;
    }

    discoverIsland(nearby);

    const rewards = [
        25,
        50,
        75,
        100,
        150
    ];

    const reward =
        rewards[Math.floor(Math.random() * rewards.length)];

    game.captain.gold += reward;

    setMessage(
        `🏝️ You explored ${nearby.name} and found ${reward} gold!`
    );

    updateUI();
    saveGame();
}

// ============================================================
// TREASURE SYSTEM
// ============================================================

function findTreasure() {
    if (!game.started) {
        return;
    }

    let minimum = 25;
    let maximum = 150;

    if (game.upgrades.treasureCompass) {
        minimum = 100;
        maximum = 300;
    }

    const amount =
        Math.floor(
            Math.random() *
            (maximum - minimum + 1)
        ) + minimum;

    game.captain.gold += amount;

    setMessage(
        `💰 TREASURE FOUND! +${amount} gold!`
    );

    updateUI();
    saveGame();
}

// ============================================================
// BATTLE SYSTEM
// ============================================================

function startBattle(enemy = null) {
    if (!game.started) {
        return;
    }

    if (!enemy) {
        enemy =
            DATA.enemies[
                Math.floor(
                    Math.random() *
                    DATA.enemies.length
                )
            ];
    }

    game.currentEnemy = enemy;
    game.battleEnemyHealth = enemy.health;

    showBattleScreen();

    updateBattleUI();

    setMessage(
        `${enemy.emoji} ${enemy.name} attacks your crew!`
    );
}

function playerAttack() {
    if (!game.currentEnemy) {
        return;
    }

    const rankData = getDragonRankData();

    const damage = Math.max(
        5,
        Math.floor(
            game.dragon.power *
            rankData.powerMultiplier
        )
    );

    game.battleEnemyHealth -= damage;

    if (game.battleEnemyHealth <= 0) {
        winBattle();
        return;
    }

    enemyAttack();
    updateBattleUI();
}

function dragonSpecialAttack() {
    if (!game.currentEnemy || !game.dragon) {
        return;
    }

    const rankData = getDragonRankData();

    const damage = Math.floor(
        game.dragon.power *
        rankData.powerMultiplier *
        1.8
    );

    game.battleEnemyHealth -= damage;

    setMessage(
        `🐉 ${game.dragon.special}! ${damage} damage!`
    );

    if (game.battleEnemyHealth <= 0) {
        winBattle();
        return;
    }

    enemyAttack();
    updateBattleUI();
}

function enemyAttack() {
    if (!game.currentEnemy) {
        return;
    }

    let damage = game.currentEnemy.power;

    if (game.upgrades.reinforcedHull) {
        damage = Math.max(
            1,
            Math.floor(damage * 0.7)
        );
    }

    game.ship.health -= damage;

    if (game.ship.health <= 0) {
        game.ship.health = 0;

        loseBattle();
    }
}

function winBattle() {
    const enemy = game.currentEnemy;

    if (!enemy) {
        return;
    }

    game.captain.gold += enemy.reward;

    game.defeatedEnemies++;

    giveDragonExperience(25);

    setMessage(
        `🏆 Victory! ${enemy.name} defeated! +${enemy.reward} gold!`
    );

    game.currentEnemy = null;

    hideBattleScreen();

    updateUI();
    saveGame();
}

function loseBattle() {
    game.ship.health = Math.max(
        1,
        Math.floor(game.ship.maxHealth * 0.4)
    );

    game.currentEnemy = null;

    setMessage(
        "💥 Your ship was badly damaged! You escaped."
    );

    hideBattleScreen();

    updateUI();
}

// ============================================================
// SHOP SYSTEM
// ============================================================

function buyItem(itemId) {
    const item = DATA.items[itemId];

    if (!item) {
        return;
    }

    if (game.upgrades[itemId]) {
        setMessage(
            `${item.emoji} You already own ${item.name}.`
        );
        return;
    }

    if (game.captain.gold < item.price) {
        setMessage(
            `❌ You need ${item.price - game.captain.gold} more gold.`
        );
        return;
    }

    game.captain.gold -= item.price;

    game.upgrades[itemId] = true;

    applyUpgrade(itemId);

    setMessage(
        `${item.emoji} Purchased ${item.name}!`
    );

    updateUI();
    saveGame();
}

function applyUpgrade(itemId) {
    if (itemId === "reinforcedHull") {
        game.ship.maxHealth += 50;
        game.ship.health += 50;
    }

    if (itemId === "dragonSaddle") {
        game.ship.speed += 2;
    }
}

// ============================================================
// QUEST SYSTEM
// ============================================================

function acceptQuest(questId) {
    const quest =
        DATA.quests.find(
            q => q.id === questId
        );

    if (!quest) {
        return;
    }

    if (
        game.quests.some(
            q => q.id === questId
        )
    ) {
        setMessage(
            `📜 You already accepted "${quest.name}".`
        );
        return;
    }

    game.quests.push({
        id: quest.id,
        progress: 0,
        completed: false
    });

    setMessage(
        `📜 Quest accepted: ${quest.name}`
    );

    updateUI();
    saveGame();
}

function updateQuestProgress(event) {
    for (const activeQuest of game.quests) {
        const quest =
            DATA.quests.find(
                q => q.id === activeQuest.id
            );

        if (!quest || activeQuest.completed) {
            continue;
        }

        if (event === "discover-island") {
            activeQuest.progress++;
        }

        if (event === "defeat-enemy") {
            activeQuest.progress++;
        }

        checkQuestCompletion(activeQuest, quest);
    }
}

function checkQuestCompletion(activeQuest, quest) {
    let needed = 1;

    if (quest.id === "skull-reef") {
        needed = 2;
    }

    if (quest.id === "ancient-secret") {
        needed = 5;
    }

    if (activeQuest.progress >= needed) {
        activeQuest.completed = true;

        game.captain.gold += quest.reward;

        setMessage(
            `🎉 Quest complete! +${quest.reward} gold!`
        );
    }
}

// ============================================================
// UI UPDATES
// ============================================================

function updateUI() {
    updateStats();
    updateDragon();
    updateShipPosition();
    updateInventory();
    updateQuests();
    updateDiscoveredIslands();
}

function updateStats() {
    setText(
        "gold",
        `💰 ${game.captain.gold}`
    );

    setText(
        "health",
        `❤️ ${game.ship.health}/${game.ship.maxHealth}`
    );

    setText(
        "captainLevel",
        `⭐ Level ${game.captain.level}`
    );

    setText(
        "defeatedEnemies",
        `⚔️ Victories: ${game.defeatedEnemies}`
    );
}

function updateDragon() {
    if (!game.dragon) {
        return;
    }

    const rankData = getDragonRankData();

    setText(
        "dragonName",
        `${game.dragon.emoji} ${game.dragon.name}`
    );

    setText(
        "dragonType",
        `Type: ${game.dragon.type}`
    );

    setText(
        "dragonRank",
        `Rank ${game.dragon.rank}: ${rankData.name}`
    );

    setText(
        "dragonHealth",
        `❤️ ${game.dragon.health}/${game.dragon.maxHealth}`
    );

    setText(
        "dragonPower",
        `⚔️ Power: ${game.dragon.power}`
    );

    setText(
        "dragonSpecial",
        `✨ ${game.dragon.special}`
    );
}

function updateInventory() {
    const inventory =
        $("inventory");

    if (!inventory) {
        return;
    }

    inventory.innerHTML = "";

    for (const item of game.inventory) {
        const div = document.createElement("div");

        div.textContent = `🎒 ${item}`;

        inventory.appendChild(div);
    }
}

function updateQuests() {
    const questList =
        $("questList");

    if (!questList) {
        return;
    }

    questList.innerHTML = "";

    for (const activeQuest of game.quests) {
        const quest =
            DATA.quests.find(
                q => q.id === activeQuest.id
            );

        if (!quest) {
            continue;
        }

        const div =
            document.createElement("div");

        div.className =
            activeQuest.completed
                ? "quest completed"
                : "quest";

        div.innerHTML = `
            <strong>${quest.name}</strong>
            <br>
            ${quest.description}
            <br>
            Progress:
            ${activeQuest.progress}
            ${activeQuest.completed ? " ✅ COMPLETE" : ""}
        `;

        questList.appendChild(div);
    }
}

function updateDiscoveredIslands() {
    setText(
        "islandCount",
        `🏝️ Islands discovered: ${game.discoveredIslands.length}/${DATA.islands.length}`
    );
}

// ============================================================
// BATTLE UI
// ============================================================

function updateBattleUI() {
    if (!game.currentEnemy) {
        return;
    }

    setText(
        "enemyName",
        `${game.currentEnemy.emoji} ${game.currentEnemy.name}`
    );

    setText(
        "enemyHealth",
        `❤️ ${Math.max(
            0,
            game.battleEnemyHealth
        )}/${game.currentEnemy.health}`
    );
}

// ============================================================
// SCREEN MANAGEMENT
// ============================================================

function hideTitleScreen() {
    hide("titleScreen");
    hide("startScreen");
}

function showGameScreen() {
    show("gameScreen");
    show("mainGame");
}

function showBattleScreen() {
    show("battleScreen");
}

function hideBattleScreen() {
    hide("battleScreen");
}

// ============================================================
// KEYBOARD CONTROLS
// ============================================================

document.addEventListener(
    "keydown",
    event => {
        const key =
            event.key.toLowerCase();

        if (
            ["w", "a", "s", "d", "arrowup",
             "arrowdown", "arrowleft",
             "arrowright"].includes(key)
        ) {
            event.preventDefault();
        }

        if (key === "w" || key === "arrowup") {
            game.keys.w = true;
        }

        if (key === "a" || key === "arrowleft") {
            game.keys.a = true;
        }

        if (key === "s" || key === "arrowdown") {
            game.keys.s = true;
        }

        if (key === "d" || key === "arrowright") {
            game.keys.d = true;
        }

        if (key === "e") {
            exploreIsland();
        }

        if (key === "b") {
            startBattle();
        }

        if (key === "t") {
            findTreasure();
        }

        if (key === "q") {
            setMessage("📜 Quest board opened!");
        }
    }
);

document.addEventListener(
    "keyup",
    event => {
        const key =
            event.key.toLowerCase();

        if (key === "w" || key === "arrowup") {
            game.keys.w = false;
        }

        if (key === "a" || key === "arrowleft") {
            game.keys.a = false;
        }

        if (key === "s" || key === "arrowdown") {
            game.keys.s = false;
        }

        if (key === "d" || key === "arrowright") {
            game.keys.d = false;
        }
    }
);

// ============================================================
// MOVEMENT LOOP
// ============================================================

let lastMovement = 0;

function movementLoop(timestamp) {
    if (
        game.started &&
        timestamp - lastMovement > 100
    ) {
        let dx = 0;
        let dy = 0;

        if (game.keys.w) {
            dy -= 1;
        }

        if (game.keys.s) {
            dy += 1;
        }

        if (game.keys.a) {
            dx -= 1;
        }

        if (game.keys.d) {
            dx += 1;
        }

        if (dx !== 0 || dy !== 0) {
            moveShip(dx, dy);
        }

        lastMovement = timestamp;
    }

    requestAnimationFrame(movementLoop);
}

requestAnimationFrame(movementLoop);

// ============================================================
// BUTTON CONNECTIONS
// ============================================================

function connectButtons() {

    // Dragon selection
    document
        .querySelectorAll(
            "[data-dragon]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => chooseDragonFromButton(button)
            );
        });

    // Movement buttons
    const movementButtons = {
        up: [0, -1],
        down: [0, 1],
        left: [-1, 0],
        right: [1, 0]
    };

    for (
        const [direction, movement]
        of Object.entries(movementButtons)
    ) {

        const possibleIds = [
            direction,
            `move${direction}`,
            `move-${direction}`
        ];

        for (const id of possibleIds) {
            const button = $(id);

            if (button) {
                button.addEventListener(
                    "click",
                    () => moveShip(
                        movement[0],
                        movement[1]
                    )
                );

                break;
            }
        }
    }

    // Common action buttons
    const exploreButton =
        $("exploreButton");

    if (exploreButton) {
        exploreButton.addEventListener(
            "click",
            exploreIsland
        );
    }

    const battleButton =
        $("battleButton");

    if (battleButton) {
        battleButton.addEventListener(
            "click",
            () => startBattle()
        );
    }

    const treasureButton =
        $("treasureButton");

    if (treasureButton) {
        treasureButton.addEventListener(
            "click",
            findTreasure
        );
    }

    const attackButton =
        $("attackButton");

    if (attackButton) {
        attackButton.addEventListener(
            "click",
            playerAttack
        );
    }

    const specialButton =
        $("specialButton");

    if (specialButton) {
        specialButton.addEventListener(
            "click",
            dragonSpecialAttack
        );
    }

    // Save
    const saveButton =
        $("saveButton");

    if (saveButton) {
        saveButton.addEventListener(
            "click",
            saveGame
        );
    }

    // Shop buttons
    document
        .querySelectorAll(
            "[data-item]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => buyItem(
                    button.dataset.item
                )
            );
        });

    // Quest buttons
    document
        .querySelectorAll(
            "[data-quest]"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => acceptQuest(
                    button.dataset.quest
                )
            );
        });
}

// ============================================================
// INITIALIZE
// ============================================================

function initializeGame() {

    const loaded =
        loadGame();

    if (loaded && game.dragon) {
        game.started = true;

        hideTitleScreen();
        showGameScreen();

        setMessage(
            `🏴‍☠️ Welcome back, ${game.captain.name}!`
        );
    }

    connectButtons();
    updateUI();

    console.log(
        "🐉 Dragon Pirates game engine loaded!"
    );
}

if (
    document.readyState === "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeGame
    );
} else {
    initializeGame();
}
