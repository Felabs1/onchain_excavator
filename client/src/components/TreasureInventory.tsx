import { motion } from "motion/react";
import { Gem, Trophy, Shield, Coins, Package } from "lucide-react";
import { Badge } from "./ui/badge";

interface TreasureCount {
  rarity: "common" | "rare" | "epic" | "legendary";
  count: number;
  value: number;
}

interface TreasureInventoryProps {
  treasures: TreasureCount[];
}

const treasureConfig = {
  common: {
    icon: Coins,
    label: "Common",
    color: "text-gray-400",
    bgColor: "bg-gray-700/30",
    borderColor: "border-gray-500/30",
    badgeVariant: "secondary" as const,
  },
  rare: {
    icon: Gem,
    label: "Rare",
    color: "text-cyan-400",
    bgColor: "bg-cyan-900/30",
    borderColor: "border-cyan-500/30",
    badgeVariant: "secondary" as const,
  },
  epic: {
    icon: Shield,
    label: "Epic",
    color: "text-purple-400",
    bgColor: "bg-purple-900/30",
    borderColor: "border-purple-500/30",
    badgeVariant: "secondary" as const,
  },
  legendary: {
    icon: Trophy,
    label: "Legendary",
    color: "text-amber-400",
    bgColor: "bg-amber-900/30",
    borderColor: "border-amber-500/30",
    badgeVariant: "secondary" as const,
  },
};

export function TreasureInventory({ treasures }: TreasureInventoryProps) {
  const totalTreasures = treasures.reduce((sum, t) => sum + t.count, 0);

  return (
    <div className="p-4 bg-gradient-to-b from-gray-900/50 to-black/50 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-cyan-400" />
          <h2 className="text-cyan-100">Treasure Vault</h2>
        </div>
        <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">
          {totalTreasures} Total
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {treasures.map((treasure, index) => {
          const config = treasureConfig[treasure.rarity];
          const Icon = config.icon;

          return (
            <motion.div
              key={treasure.rarity}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`
                p-4 rounded-lg border ${config.borderColor} ${config.bgColor}
                backdrop-blur-sm
              `}
            >
              <div className="flex items-start justify-between mb-2">
                <Icon className={`w-5 h-5 ${config.color}`} />
                <Badge variant={config.badgeVariant} className="text-xs">
                  {treasure.count}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className={`text-sm ${config.color}`}>
                  {config.label}
                </div>
                <div className="text-xs text-gray-500">
                  {treasure.value} pts each
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalTreasures === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No treasures yet. Start excavating!</p>
        </div>
      )}
    </div>
  );
}
