import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Pickaxe, RotateCcw, Sparkles } from "lucide-react";
import { GameGrid, Tile, TreasureRarity } from "./components/GameGrid";
import { PlayerStats } from "./components/PlayerStats";
import { Leaderboard } from "./components/Leaderboard";
import { TreasureInventory } from "./components/TreasureInventory";
import { WalletConnect } from "./components/WalletConnect";
import { Button } from "./components/ui/button";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

const GRID_SIZE = 64; // 8x8 grid
const MAX_ENERGY = 50;
const ENERGY_PER_DIG = 1;
const MAX_HEALTH = 100;
const TRAP_DAMAGE = 25;

// Treasure value configuration
const TREASURE_VALUES = {
  common: 10,
  rare: 50,
  epic: 150,
  legendary: 500,
};

// Treasure spawn rates (approximate)
const TREASURE_SPAWN_RATES = {
  common: 0.4,    // 40%
  rare: 0.25,     // 25%
  epic: 0.08,     // 8%
  legendary: 0.02, // 2%
  // 25% chance of no treasure
};

const TRAP_SPAWN_RATE = 0.15; // 15% chance of trap

function generateRandomTreasure(): TreasureRarity {
  const rand = Math.random();
  
  if (rand < TREASURE_SPAWN_RATES.legendary) return "legendary";
  if (rand < TREASURE_SPAWN_RATES.legendary + TREASURE_SPAWN_RATES.epic) return "epic";
  if (rand < TREASURE_SPAWN_RATES.legendary + TREASURE_SPAWN_RATES.epic + TREASURE_SPAWN_RATES.rare) return "rare";
  if (rand < TREASURE_SPAWN_RATES.legendary + TREASURE_SPAWN_RATES.epic + TREASURE_SPAWN_RATES.rare + TREASURE_SPAWN_RATES.common) return "common";
  
  return null;
}

function initializeTiles(): Tile[] {
  return Array.from({ length: GRID_SIZE }, (_, i) => {
    const hasTrap = Math.random() < TRAP_SPAWN_RATE;
    return {
      id: i,
      excavated: false,
      treasure: hasTrap ? null : generateRandomTreasure(), // No treasure if there's a trap
      hasTrap,
    };
  });
}

// Mock leaderboard data
const mockLeaderboard = [
  { rank: 1, address: "0x742d...a3f1", treasures: 89, value: 12450, isCurrentUser: false },
  { rank: 2, address: "0x8f3e...d2c4", treasures: 76, value: 10830, isCurrentUser: false },
  { rank: 3, address: "0x1a9b...f7e2", treasures: 68, value: 9240, isCurrentUser: true },
  { rank: 4, address: "0xc4d7...b8a9", treasures: 54, value: 7680, isCurrentUser: false },
  { rank: 5, address: "0x5e2f...c1d6", treasures: 47, value: 6290, isCurrentUser: false },
];

export default function App() {
  const [tiles, setTiles] = useState<Tile[]>(initializeTiles());
  const [energy, setEnergy] = useState(MAX_ENERGY);
  const [health, setHealth] = useState(MAX_HEALTH);
  const [excavations, setExcavations] = useState(0);
  const [treasuresFound, setTreasuresFound] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [treasureCounts, setTreasureCounts] = useState({
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  });

  const handleExcavate = (id: number) => {
    if (health <= 0) {
      toast.error("Game Over!", {
        description: "Reset the grid to play again.",
      });
      return;
    }

    if (energy < ENERGY_PER_DIG) {
      toast.error("Not enough energy!", {
        description: "Wait for energy to regenerate or reset the grid.",
      });
      return;
    }

    const tile = tiles[id];
    if (tile.excavated) return;

    // Update tile state
    setTiles((prev) =>
      prev.map((t) => (t.id === id ? { ...t, excavated: true } : t))
    );

    // Update stats
    setEnergy((prev) => prev - ENERGY_PER_DIG);
    setExcavations((prev) => prev + 1);

    // Check for trap first
    if (tile.hasTrap) {
      const newHealth = Math.max(0, health - TRAP_DAMAGE);
      setHealth(newHealth);
      
      toast.error("💥 TRAP ACTIVATED!", {
        description: `You hit a trap! -${TRAP_DAMAGE} health`,
      });

      if (newHealth === 0) {
        toast.error("💀 You have been eliminated!", {
          description: "Game Over. Reset to try again.",
        });
      }
      return;
    }

    // Check for treasure
    if (tile.treasure) {
      const value = TREASURE_VALUES[tile.treasure];
      setTreasuresFound((prev) => prev + 1);
      setTotalValue((prev) => prev + value);
      setTreasureCounts((prev) => ({
        ...prev,
        [tile.treasure as string]: prev[tile.treasure as keyof typeof prev] + 1,
      }));

      // Show toast based on rarity
      const messages = {
        common: { title: "Found Common Treasure!", icon: "💰" },
        rare: { title: "Found Rare Treasure!", icon: "💎" },
        epic: { title: "Found Epic Treasure!", icon: "🛡️" },
        legendary: { title: "LEGENDARY TREASURE FOUND!", icon: "🏆" },
      };

      const msg = messages[tile.treasure];
      toast.success(msg.title, {
        description: `${msg.icon} +${value} points`,
      });
    }
  };

  const handleReset = () => {
    setTiles(initializeTiles());
    setEnergy(MAX_ENERGY);
    setHealth(MAX_HEALTH);
    setExcavations(0);
    setTreasuresFound(0);
    setTotalValue(0);
    setTreasureCounts({
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    });
    toast.info("Grid reset! Good luck, excavator.");
  };

  const handleWalletConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleWalletDisconnect = () => {
    setWalletAddress("");
  };

  // Energy regeneration (1 energy per 3 seconds)
  useEffect(() => {
    if (energy >= MAX_ENERGY) return;

    const interval = setInterval(() => {
      setEnergy((prev) => Math.min(prev + 1, MAX_ENERGY));
    }, 3000);

    return () => clearInterval(interval);
  }, [energy]);

  const treasureInventory = [
    { rarity: "common" as const, count: treasureCounts.common, value: TREASURE_VALUES.common },
    { rarity: "rare" as const, count: treasureCounts.rare, value: TREASURE_VALUES.rare },
    { rarity: "epic" as const, count: treasureCounts.epic, value: TREASURE_VALUES.epic },
    { rarity: "legendary" as const, count: treasureCounts.legendary, value: TREASURE_VALUES.legendary },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-blue-950 to-black text-white p-6">
      <Toaster />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                <Pickaxe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-cyan-100 flex items-center gap-2">
                  Onchain Excavator
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </h1>
                <p className="text-gray-400 text-sm">
                  Dig. Discover. Dominate the mines.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <WalletConnect 
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
            <Button
              onClick={handleReset}
              variant="outline"
              className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Grid
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Game Area */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Player Stats & Inventory */}
        <div className="space-y-6">
          <PlayerStats
            energy={energy}
            maxEnergy={MAX_ENERGY}
            health={health}
            maxHealth={MAX_HEALTH}
            excavations={excavations}
            treasuresFound={treasuresFound}
            totalValue={totalValue}
          />
          <TreasureInventory treasures={treasureInventory} />
        </div>

        {/* Center Column - Game Grid */}
        <div className="lg:col-span-1">
          <GameGrid
            tiles={tiles}
            onExcavate={handleExcavate}
            canExcavate={energy >= ENERGY_PER_DIG && health > 0}
          />
          
          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700/30 backdrop-blur-sm"
          >
            <p className="text-gray-400 text-sm text-center">
              Click tiles to excavate and discover treasures. Each dig costs{" "}
              <span className="text-cyan-400">{ENERGY_PER_DIG} energy</span>.
              <br />
              <span className="text-red-400">⚠️ Beware of traps!</span> They deal{" "}
              <span className="text-red-400">{TRAP_DAMAGE} damage</span>.
            </p>
          </motion.div>
        </div>

        {/* Right Column - Leaderboard */}
        <div>
          <Leaderboard entries={mockLeaderboard} />
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-7xl mx-auto mt-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/30 rounded-full border border-cyan-500/20">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-gray-400 text-sm">
            Powered by Dojo on Starknet
          </span>
        </div>
      </motion.div>
    </div>
  );
}