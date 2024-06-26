import { create } from "zustand";
export { useEnemies } from "./store/useEnemies";
export { usePlayers, usePlayerHurt } from "./store/usePlayers";
export { useGame } from "./store/useGame";

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
