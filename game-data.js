// ============================================
// DRAGON PIRATES
// GAME DATA
// ============================================

const DragonPiratesData = {

    // -----------------------------
    // DRAGONS
    // -----------------------------

    dragons: {

        Ember: {
            type: "Fire",
            emoji: "🐲",
            power: 8,
            speed: 5,
            health: 100,
            special: "Flame Burst",
            description:
                "A powerful fire dragon with incredible attack strength."
        },

        Gale: {
            type: "Wind",
            emoji: "🐉",
            power: 5,
            speed: 9,
            health: 100,
            special: "Cyclone Strike",
            description:
                "A fast wind dragon capable of moving across the sea quickly."
        },

        Tide: {
            type: "Water",
            emoji: "🌊",
            power: 7,
            speed: 7,
            health: 100,
            special: "Tidal Crash",
            description:
                "A water dragon that can survive deep underwater."
        },

        Shadow: {
            type: "Dark",
            emoji: "🐉",
            power: 9,
            speed: 8,
            health: 110,
            special: "Shadow Break",
            description:
                "A rare dragon that hides in the darkest parts of the ocean."
        },

        Storm: {
            type: "Lightning",
            emoji: "⚡",
            power: 10,
            speed: 9,
            health: 120,
            special: "Thunder Strike",
            description:
                "An extremely rare dragon that commands lightning."
        }

    },


    // -----------------------------
    // ISLANDS
    // -----------------------------

    islands: [

        {
            id: "stormbreak",
            name: "Stormbreak Island",
            emoji: "🏝️",
            x: 12,
            y: 18,
            level: 1,
            danger: "Low",
            description:
                "A peaceful island filled with old pirate ruins."
        },

        {
            id: "dragons-rest",
            name: "Dragon's Rest",
            emoji: "🐉",
            x: 72,
            y: 20,
            level: 3,
            danger: "Medium",
            description:
                "A mysterious island where dragons gather."
        },

        {
            id: "skull-reef",
            name: "Skull Reef",
            emoji: "💀",
            x: 40,
            y: 67,
            level: 5,
            danger: "High",
            description:
                "A dangerous pirate hideout surrounded by reefs."
        },

        {
            id: "golden-isle",
            name: "Golden Isle",
            emoji: "💰",
            x: 70,
            y: 72,
            level: 7,
            danger: "High",
            description:
                "An island rumored to contain an ancient pirate treasure."
        },

        {
            id: "storm-island",
            name: "Storm Island",
            emoji: "⛈️",
            x: 20,
            y: 72,
            level: 10,
            danger: "Extreme",
            description:
                "A dangerous island surrounded by permanent storms."
        },

        {
            id: "dragon-graveyard",
            name: "Dragon Graveyard",
            emoji: "☠️",
            x: 85,
            y: 50,
            level: 15,
            danger: "Extreme",
            description:
                "An ancient island filled with the remains of legendary dragons."
        }

    ],


    // -----------------------------
    // PIRATE CREWS
    // -----------------------------

    pirateCrews: [

        {
            id: "stormfang",
            name: "Stormfang Pirates",
            emoji: "🏴‍☠️",
            strength: 10,
            leader: "Captain Vex",
            description:
                "A dangerous pirate crew hunting rare dragons."
        },

        {
            id: "crimson",
            name: "Crimson Skull Pirates",
            emoji: "☠️",
            strength: 20,
            leader: "Captain Rook",
            description:
                "A powerful crew controlling the western seas."
        },

        {
            id: "sky",
            name: "Sky Sailors",
            emoji: "🦅",
            strength: 15,
            leader: "Captain Mira",
            description:
                "Pirates who specialize in fast ships and wind dragons."
        }

    ],


    // -----------------------------
    // ITEMS
    // -----------------------------

    items: {

        reinforcedHull: {
            name: "Reinforced Hull",
            price: 150,
            emoji: "⚓",
            description:
                "Makes your ship stronger."
        },

        dragonSaddle: {
            name: "Dragon Saddle",
            price: 250,
            emoji: "🐉",
            description:
                "Allows your dragon to travel faster."
        },

        treasureCompass: {
            name: "Treasure Compass",
            price: 300,
            emoji: "🧭",
            description:
                "Helps locate hidden treasure."
        },

        ancientMap: {
            name: "Ancient Map",
            price: 500,
            emoji: "🗺️",
            description:
                "Shows the location of a legendary island."
        },

        dragonCrystal: {
            name: "Dragon Crystal",
            price: 750,
            emoji: "💎",
            description:
                "A mysterious crystal containing dragon energy."
        }

    },


    // -----------------------------
    // QUESTS
    // -----------------------------

    quests: [

        {
            id: "first-dragon",
            name: "The Dragon's Call",
            level: 1,
            reward: 200,
            description:
                "Find Dragon's Rest and discover why dragons gather there."
        },

        {
            id: "skull-reef",
            name: "Pirates of Skull Reef",
            level: 5,
            reward: 500,
            description:
                "Defeat the pirates controlling Skull Reef."
        },

        {
            id: "golden-treasure",
            name: "The Golden Pirate",
            level: 7,
            reward: 1000,
            description:
                "Find the legendary treasure of the ancient pirate king."
        },

        {
            id: "storm-dragon",
            name: "Eye of the Storm",
            level: 10,
            reward: 2000,
            description:
                "Survive Storm Island and find the legendary Storm Dragon."
        },

        {
            id: "ancient-secret",
            name: "The Dragon Graveyard",
            level: 15,
            reward: 5000,
            description:
                "Discover the truth behind the disappearance of the ancient dragons."
        }

    ],


    // -----------------------------
    // RANKS
    // -----------------------------

    dragonRanks: {

        10: {
            name: "Rookie Dragon",
            powerMultiplier: 1
        },

        9: {
            name: "Young Dragon",
            powerMultiplier: 1.1
        },

        8: {
            name: "Skilled Dragon",
            powerMultiplier: 1.2
        },

        7: {
            name: "Hunter Dragon",
            powerMultiplier: 1.3
        },

        6: {
            name: "Elite Dragon",
            powerMultiplier: 1.4
        },

        5: {
            name: "Champion Dragon",
            powerMultiplier: 1.5
        },

        4: {
            name: "Legend Dragon",
            powerMultiplier: 1.7
        },

        3: {
            name: "Ancient Dragon",
            powerMultiplier: 2
        },

        2: {
            name: "Mythic Dragon",
            powerMultiplier: 2.5
        },

        1: {
            name: "☠️ LEGENDARY DRAGON ☠️",
            powerMultiplier: 3
        }

    },


    // -----------------------------
    // ENEMIES
    // -----------------------------

    enemies: [

        {
            name: "Sea Raider",
            emoji: "🏴‍☠️",
            health: 60,
            power: 8,
            reward: 50
        },

        {
            name: "Pirate Hunter",
            emoji: "⚔️",
            health: 90,
            power: 12,
            reward: 100
        },

        {
            name: "Wild Dragon",
            emoji: "🐲",
            health: 100,
            power: 15,
            reward: 150
        },

        {
            name: "Dragon Guardian",
            emoji: "🐉",
            health: 180,
            power: 25,
            reward: 300
        },

        {
            name: "Ancient Sea Beast",
            emoji: "🦑",
            health: 300,
            power: 35,
            reward: 750
        }

    ]

};


// Make the data available to the game.

if (typeof window !== "undefined") {

    window.DragonPiratesData = DragonPiratesData;

}

console.log(
    "🐉 Dragon Pirates game data loaded!"
);
