import { motion } from "motion/react";
import { Trophy, Medal, Award, User } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useLeaderboard } from "../dojo/hooks/useLeaderboard";

interface LeaderboardEntry {
  rank: number;
  address: string;
  treasures: number;
  value: number;
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const rankIcons: Record<number, any> = {
  1: Trophy,
  2: Medal,
  3: Award,
};

const rankColors: Record<number, string> = {
  1: "text-yellow-400",
  2: "text-gray-300",
  3: "text-amber-600",
};

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <div className="p-4 bg-gradient-to-b from-gray-900/50 to-black/50 rounded-xl border border-cyan-500/20 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h2 className="text-cyan-100">Top Excavators</h2>
      </div>

      <div className="space-y-2">
        {entries.map((entry, index) => {
          const RankIcon = rankIcons[entry.rank];
          const rankColor = rankColors[entry.rank] || "text-gray-500";

          return (
            <motion.div
              key={entry.address}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                flex items-center gap-3 p-3 rounded-lg
                ${
                  entry.isCurrentUser
                    ? "bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/50"
                    : "bg-gray-800/30 hover:bg-gray-800/50"
                }
                transition-colors duration-200
              `}
            >
              {/* Rank */}
              <div className="w-8 flex items-center justify-center">
                {RankIcon ? (
                  <RankIcon className={`w-5 h-5 ${rankColor}`} />
                ) : (
                  <span className="text-gray-500">#{entry.rank}</span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="w-8 h-8 border-2 border-cyan-500/30">
                <AvatarFallback className="bg-gradient-to-br from-cyan-600 to-blue-600 text-white text-xs">
                  {entry.address.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Address */}
              <div className="flex-1">
                <div
                  className={`text-sm ${
                    entry.isCurrentUser ? "text-cyan-300" : "text-gray-300"
                  }`}
                >
                  {entry.address}
                  {entry.isCurrentUser && (
                    <span className="ml-2 text-xs text-cyan-400">(You)</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className="text-amber-400 text-sm">
                  {entry.treasures} 💎
                </div>
                <div className="text-gray-500 text-xs">{entry.value} pts</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
