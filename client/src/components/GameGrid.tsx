import { motion } from "motion/react";
import { Pickaxe, Gem, Trophy, Coins, Zap, Shield, Skull } from "lucide-react";
import { useState } from "react";

export type TreasureRarity = "common" | "rare" | "epic" | "legendary" | null;

export interface Tile {
  id: number;
  excavated: boolean;
  treasure: TreasureRarity;
  hasTrap: boolean;
}

interface GameGridProps {
  tiles: Tile[];
  onExcavate: (id: number) => void;
  canExcavate: boolean;
}

const treasureIcons: Record<Exclude<TreasureRarity, null>, any> = {
  common: Coins,
  rare: Gem,
  epic: Shield,
  legendary: Trophy,
};

const treasureColors: Record<Exclude<TreasureRarity, null>, string> = {
  common: "from-gray-400 to-gray-600",
  rare: "from-blue-400 to-cyan-500",
  epic: "from-purple-500 to-pink-500",
  legendary: "from-yellow-400 to-amber-500",
};

const treasureGlow: Record<Exclude<TreasureRarity, null>, string> = {
  common: "shadow-[0_0_20px_rgba(156,163,175,0.5)]",
  rare: "shadow-[0_0_30px_rgba(34,211,238,0.7)]",
  epic: "shadow-[0_0_30px_rgba(168,85,247,0.7)]",
  legendary: "shadow-[0_0_40px_rgba(251,191,36,0.9)]",
};

export function GameGrid({ tiles, onExcavate, canExcavate }: GameGridProps) {
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-8 gap-2 p-6 bg-gradient-to-b from-gray-900/50 to-black/50 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
      {tiles.map((tile) => {
        const TreasureIcon = tile.treasure ? treasureIcons[tile.treasure] : null;
        const isTrap = tile.hasTrap && tile.excavated;
        
        return (
          <motion.button
            key={tile.id}
            onClick={() => !tile.excavated && canExcavate && onExcavate(tile.id)}
            onHoverStart={() => setHoveredTile(tile.id)}
            onHoverEnd={() => setHoveredTile(null)}
            disabled={tile.excavated || !canExcavate}
            className={`
              relative aspect-square rounded-lg overflow-hidden
              ${tile.excavated ? 'cursor-default' : canExcavate ? 'cursor-pointer' : 'cursor-not-allowed'}
              ${!tile.excavated && canExcavate ? 'hover:scale-105' : ''}
              transition-transform duration-200
            `}
            whileTap={!tile.excavated && canExcavate ? { scale: 0.95 } : {}}
          >
            {!tile.excavated ? (
              <div
                className={`
                  w-full h-full bg-gradient-to-br from-gray-700 to-gray-800
                  border-2 ${hoveredTile === tile.id && canExcavate ? 'border-cyan-400' : 'border-gray-600'}
                  flex items-center justify-center
                  transition-all duration-300
                  ${hoveredTile === tile.id && canExcavate ? 'shadow-[0_0_15px_rgba(34,211,238,0.5)]' : ''}
                `}
              >
                <Pickaxe
                  className={`
                    w-5 h-5
                    ${hoveredTile === tile.id && canExcavate ? 'text-cyan-400' : 'text-gray-500'}
                    transition-colors duration-300
                  `}
                />
              </div>
            ) : isTrap ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-900 to-orange-900 border-2 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.7)]"
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                >
                  <Skull className="w-6 h-6 text-red-400 drop-shadow-lg" />
                </motion.div>
                {/* Danger particles */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="absolute top-1 left-1 w-1 h-1 bg-red-400 rounded-full" />
                  <div className="absolute top-1 right-1 w-1 h-1 bg-orange-400 rounded-full" />
                  <div className="absolute bottom-1 left-1 w-1 h-1 bg-red-400 rounded-full" />
                  <div className="absolute bottom-1 right-1 w-1 h-1 bg-orange-400 rounded-full" />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`
                  w-full h-full flex items-center justify-center
                  ${tile.treasure 
                    ? `bg-gradient-to-br ${treasureColors[tile.treasure]} ${treasureGlow[tile.treasure]}`
                    : 'bg-gradient-to-br from-gray-800 to-gray-900'
                  }
                  border-2 ${tile.treasure ? 'border-white/30' : 'border-gray-700'}
                `}
              >
                {TreasureIcon ? (
                  <motion.div
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <TreasureIcon className="w-6 h-6 text-white drop-shadow-lg" />
                  </motion.div>
                ) : (
                  <div className="w-4 h-4 rounded-full bg-gray-700" />
                )}
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}