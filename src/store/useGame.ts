import type { Application } from "@pixi/app";
import { create } from "zustand";

export const useGame = create<{
  app: Application | null;
  setApp: (app: Application | null) => void;
  isGamePaused: boolean;
  setIsGamePaused: (value: boolean) => void;
  clientPlayerId: string;
  setClientPlayerId: (id: string) => void;
  gameover: boolean;
  setGameover: (value: boolean) => void;
  isLevelUp: boolean;
  setIsLevelUp: (value: boolean) => void;
}>()((set, get) => ({
  app: null,
  setApp: (app) => set({ app }),
  isGamePaused: false,
  setIsGamePaused: (value: boolean) => {
    set({ isGamePaused: value });
    if (value) {
      get().app?.ticker.stop();
    } else {
      get().app?.ticker.start();
    }
  },
  clientPlayerId: "",
  setClientPlayerId: (id: string) => set({ clientPlayerId: id }),
  gameover: false,
  setGameover: (value: boolean) => {
    set({ gameover: value });
    get().setIsGamePaused(value);
  },
  isLevelUp: false,
  setIsLevelUp: (value: boolean) => {
    set({ isLevelUp: value });
    get().setIsGamePaused(value);
  },
}));
