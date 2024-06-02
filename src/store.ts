import { create } from "zustand";
export { useEnemies } from "./store/useEnemies";

export const useCamera = create<{
  x: number;
  y: number;
  setX: (x: number) => void;
  setY: (y: number) => void;
}>()((set) => ({
  x: 0,
  y: 0,
  setX: (x: number) => set({ x }),
  setY: (y: number) => set({ y }),
}));

interface Player {
  // metadata
  id: string;
  name: string;
  maxHp: number;
  speed: number;
  // stats
  score: number;
  hp: number;
  strength: number;
  cooldown: number;
  speedScale: number;
}

interface Players {
  players: Record<string, Player>;
  positions: Record<string, { x: number; y: number }>;
  setPosition: (id: string, pos: { x: number; y: number }) => void;
  addPlayer(player: Player & { pos?: { x: number; y: number } }): void;
  removePlayer(id: string): void;
}

export const usePlayers = create<Players>()((set, get) => ({
  players: {},
  positions: {},
  setPosition: (id, pos) => {
    set((state) => ({
      positions: { ...state.positions, [id]: pos },
    }));
  },
  addPlayer: (player) => {
    set((state) => ({
      players: { ...state.players, [player.id]: player },
      positions: {
        ...state.positions,
        [player.id]: player.pos ?? { x: 0, y: 0 },
      },
    }));
  },
  removePlayer: (id) => {
    delete get().players[id];
    delete get().positions[id];
  },
}));
