import { create } from "zustand";

type Updater = (speed: number) => number;
interface Difficulty {
  speed: number;
  setSpeed: (speed: number | Updater) => void;
}
export const useDifficulty = create<Difficulty>()((set) => ({
  speed: 1,
  setSpeed: (speed) => {
    if (typeof speed === "number") {
      set({ speed });
    } else {
      set((state) => ({
        speed: speed(state.speed),
      }));
    }
  },
}));
