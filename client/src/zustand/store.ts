import { create } from "zustand";
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
  playerRank: PlayerRank[] | null;
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
  updatePlayerHealth: (health: number) => void;
  updatePlayerEnergy: (energy: number) => void;
  updatePlayerDigs: (digs: number) => void;
  updatePlayerTreasures: (treasures: number) => void;
  updatePlayerValue: (value: number) => void;
  updatePlayerCommon: (common: number) => void;
  updatePlayerRare: (rare: number) => void;
  updatePlayerEpic: (epic: number) => void;
  updatePlayerLegendary: (legendary: number) => void;

  setPlayerRank: (playerRank: PlayerRank[] | null) => void;
  updatePlayerRankValue: (playerValue: number) => void;
  updateTreasuresCollected: (treasuresCollected: number) => void;

  setTile: (tile: Tile | null) => void;
  //   updateId: (id: number) => void;
  updateExcavated: (excavated: boolean) => void;
  updateTreasure: (treasure: number) => void;
  updateHasTrap: (hasTrap: boolean) => void;

  //   updatePlayerCoins: (coins: number) => void;
  //   updatePlayerExperience: (experience: number) => void;
  //   updatePlayerHealth: (health: number) => void;

  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Game actions
  startGame: () => void;
  endGame: () => void;

  //   // Utility actions
  resetStore: () => void;
}

type AppStore = AppState & AppActions;

const initialState: AppState = {
  player: null,
  playerRank: null,
  mined: null,
  tile: null,
  isLoading: false,
  error: null,
  gameStarted: false,
};

const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...initialState,
      // player actions
      setPlayer: (player) => set({ player }),
      updatePlayerHealth: (health) =>
        set((state) => ({
          player: state.player ? { ...state.player, health } : null,
        })),
      updatePlayerEnergy: (energy) =>
        set((state) => ({
          player: state.player ? { ...state.player, energy } : null,
        })),
      updatePlayerDigs: (digs) =>
        set((state) => ({
          player: state.player ? { ...state.player, digs } : null,
        })),
      updatePlayerTreasures: (treasures) =>
        set((state) => ({
          player: state.player ? { ...state.player, treasures } : null,
        })),
      updatePlayerValue: (value) =>
        set((state) => ({
          player: state.player ? { ...state.player, value } : null,
        })),
      updatePlayerCommon: (common) =>
        set((state) => ({
          player: state.player ? { ...state.player, common } : null,
        })),
      updatePlayerRare: (rare) =>
        set((state) => ({
          player: state.player ? { ...state.player, rare } : null,
        })),
      updatePlayerEpic: (epic) =>
        set((state) => ({
          player: state.player ? { ...state.player, epic } : null,
        })),
      updatePlayerLegendary: (legendary) =>
        set((state) => ({
          player: state.player ? { ...state.player, legendary } : null,
        })),

      setPlayerRank: (playerRank) => set({ playerRank }),

      updatePlayerRankValue: (playerValue) =>
        set((state) => ({
          playerRank: state.playerRank
            ? { ...state.playerRank, playerValue }
            : null,
        })),
      updateTreasuresCollected: (treasuresCollected) =>
        set((state) => ({
          playerRank: state.playerRank
            ? { ...state.playerRank, treasuresCollected }
            : null,
        })),

      setTile: (tile) => set({ tile }),
      updateExcavated: (excavated) =>
        set((state) => ({
          tile: state.tile ? { ...state.tile, excavated } : null,
        })),

      updateTreasure: (treasure) =>
        set((state) => ({
          tile: state.tile ? { ...state.tile, treasure } : null,
        })),

      updateHasTrap: (hasTrap) =>
        set((state) => ({
          tile: state.tile ? { ...state.tile, hasTrap } : null,
        })),

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Game actions
      startGame: () => set({ gameStarted: true }),
      endGame: () => set({ gameStarted: false }),

      // Utility actions
      resetStore: () => set(initialState),
    }),
    {
      name: "dojo-starter-store",
      partialize: (state) => ({
        player: state.player,
        gameStarted: state.gameStarted,
      }),
    }
  )
);

export default useAppStore;
