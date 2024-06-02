import { create } from "zustand";
export { useEnemies } from "./store/useEnemies";

export const useGame = create<{
  gameover: boolean;
  setGameover: (value: boolean) => void;
}>()((set) => ({
  gameover: false,
  setGameover: (value: boolean) => set({ gameover: value }),
}));

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
  updatePlayerHp: (id: string, hp: number) => void;
  positions: Record<string, { x: number; y: number }>;
  setPosition: (id: string, pos: { x: number; y: number }) => void;
  addPlayer(player: Player & { pos?: { x: number; y: number } }): void;
  removePlayer(id: string): void;
}

export const usePlayers = create<Players>()((set, get) => ({
  players: {},
  updatePlayerHp: (id, hp) => {
    set((state) => ({
      players: { ...state.players, [id]: { ...state.players[id], hp } },
    }));
  },
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

export const usePlayerHurt = create<{
  setHurt: (id: string, value: number) => void;
  [key: string]: number | ((id: string, value: number) => void);
}>()((set) => ({
  setHurt: (id, value) => set((state) => ({ ...state, [id]: value })),
}));

type Updater = (s: number) => number;
export const useScore = create<{
  score: number;
  setScore: (score: number | Updater) => void;
}>()((set) => ({
  score: 0,
  setScore: (score) => {
    if (typeof score === "function") {
      set((state) => ({ score: score(state.score) }));
    } else {
      set({ score });
    }
  },
}));
