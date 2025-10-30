import { motion } from "motion/react";
import { Zap, Pickaxe, Trophy, TrendingUp, Heart } from "lucide-react";
import { Progress } from "./ui/progress";

interface PlayerStatsProps {
  energy: number;
  maxEnergy: number;
  excavations: number;
  treasuresFound: number;
  totalValue: number;
  health: number;
  maxHealth: number;
}

export function PlayerStats({ 
  energy, 
  maxEnergy, 
  excavations, 
  treasuresFound,
  totalValue,
  health,
  maxHealth
}: PlayerStatsProps) {
  const energyPercent = (energy / maxEnergy) * 100;
  const healthPercent = (health / maxHealth) * 100;

  return (
    <div className="space-y-4">
      {/* Health Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 bg-gradient-to-br from-red-950/50 to-pink-950/50 rounded-xl border border-red-500/30 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-red-300">Health</span>
          </div>
          <span className="text-red-100">
            {health} / {maxHealth}
          </span>
        </div>
        <Progress 
          value={healthPercent} 
          className="h-3 bg-gray-800"
        />
        {health === 0 && (
          <p className="text-red-400 text-sm mt-2">💀 Game Over! Reset to continue.</p>
        )}
      </motion.div>

      {/* Energy Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 bg-gradient-to-br from-cyan-950/50 to-blue-950/50 rounded-xl border border-cyan-500/30 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300">Energy</span>
          </div>
          <span className="text-cyan-100">
            {energy} / {maxEnergy}
          </span>
        </div>
        <Progress 
          value={energyPercent} 
          className="h-3 bg-gray-800"
        />
        {energy === 0 && (
          <p className="text-amber-400 text-sm mt-2">⚠️ No energy remaining</p>
        )}
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          icon={Pickaxe}
          label="Digs"
          value={excavations}
          color="text-gray-400"
          bgColor="from-gray-900/50 to-gray-800/50"
          borderColor="border-gray-600/30"
        />
        <StatCard
          icon={Trophy}
          label="Treasures"
          value={treasuresFound}
          color="text-amber-400"
          bgColor="from-amber-950/30 to-yellow-950/30"
          borderColor="border-amber-600/30"
        />
        <StatCard
          icon={TrendingUp}
          label="Value"
          value={totalValue}
          color="text-emerald-400"
          bgColor="from-emerald-950/30 to-green-950/30"
          borderColor="border-emerald-600/30"
        />
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

function StatCard({ icon: Icon, label, value, color, bgColor, borderColor }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-3 bg-gradient-to-br ${bgColor} rounded-lg border ${borderColor} backdrop-blur-sm`}
    >
      <Icon className={`w-4 h-4 ${color} mb-1`} />
      <div className="text-gray-400 text-xs">{label}</div>
      <div className={`${color}`}>{value}</div>
    </motion.div>
  );
}