import { create } from "zustand";
export { useEnemies } from "./store/useEnemies";
export { usePlayers, usePlayerHurt } from "./store/usePlayers";

export const useGame = create<{
  isGamePaused: boolean;
  setIsGamePaused: (value: boolean) => void;
  clientPlayerId: string;
  setClientPlayerId: (id: string) => void;
  gameover: boolean;
  setGameover: (value: boolean) => void;
}>()((set) => ({
  isGamePaused: false,
  setIsGamePaused: (value: boolean) => set({ isGamePaused: value }),
  clientPlayerId: "",
  setClientPlayerId: (id: string) => set({ clientPlayerId: id }),
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
