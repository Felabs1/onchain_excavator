import create from "zustand";
import { persist } from "zustand/middleware";

// interface matching your bindings

export interface Player {
  playerAddress: string;
  health: number;
  energy: number;
  digs: number;
  treasures: number;
  value: number;
  common: number;
  rare: number;
  epic: number;
  legendary: number;
}

export interface PlayerRank {
  playerAddress: string;
  playerValue: number;
  treasuresCollected: number;
}

// Type definition for `dojo_starter::models::Tile` struct
export interface Tile {
  id: number;
  playerAddress: string;
  excavated: boolean;
  treasure: number;
  hasTrap: boolean;
}

// Type definition for `dojo_starter::systems::actions::actions::Mined` struct
export interface Mined {
  player: string;
  tile: Tile;
}

interface AppState {
  // player data
  player: Player | null;
  playerRank: PlayerRank | null;
  tile: Tile | null;
  mined: Mined | null;

  // ui state
  isLoading: boolean;
  error: string | null;

  // game state
  gameStarted: boolean;
}

interface AppActions {
  // Player actions
  setPlayer: (player: Player | null) => void;
  //   updatePlayerCoins: (coins: number) => void;
  //   updatePlayerExperience: (experience: number) => void;
  //   updatePlayerHealth: (health: number) => void;

  //   // UI actions
  //   setLoading: (loading: boolean) => void;
  //   setError: (error: string | null) => void;

  //   // Game actions
  //   startGame: () => void;
  //   endGame: () => void;

  //   // Utility actions
  //   resetStore: () => void;
}
