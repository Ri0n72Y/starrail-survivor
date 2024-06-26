import { create } from "zustand";
import { useGame } from "./useGame";

interface Props {
  playerLvl: Record<string, number>;
  updatePlayerLvl: (ids: string[], levels: number[]) => void;
  levelUp: (id: string) => void;
  playerExp: Record<string, number>;
  /** @returns levels updated */
  updatePlayerExp: (ids: string[], exps: number[]) => Record<string, number>;
  drops: Record<string, number>;
  addDrop: (value: number, position: { x: number; y: number }) => void;
  removeDrop: (id: string) => void;
}

const baseExp = 10 as const;
const expScaleFactor = 1.2 as const;
export const useExp = create<Props>()((set, get) => ({
  playerLvl: {},
  updatePlayerLvl: (ids, levels) => {
    set((state) => {
      return {
        playerLvl: {
          ...state.playerLvl,
          ...Object.fromEntries(ids.map((id, i) => [id, levels[i]])),
        },
      };
    });
  },
  levelUp: (id) => {
    set((state) => {
      return {
        playerLvl: {
          ...state.playerLvl,
          [id]: state.playerLvl[id] + 1,
        },
      };
    });
    useGame.getState().setIsLevelUp(true);
  },
  playerExp: {},
  updatePlayerExp: (ids, exps) => {
    const nextExps: Record<string, number> = {};
    const nextLvl: Record<string, number> = {};
    ids.forEach((id, i) => {
      nextExps[id] = (get().playerExp[id] ?? 0) + exps[i];
      nextLvl[id] = get().playerLvl[id] ?? 0;
      const reqExp = baseExp * expScaleFactor ** nextLvl[id];
      if (nextExps[id] >= reqExp) {
        nextLvl[id] = nextLvl[id] + 1;
        nextExps[id] = nextExps[id] - reqExp;
      }
    });
    set((state) => {
      return {
        playerExp: {
          ...state.playerExp,
          ...nextExps,
        },
      };
    });
    return nextLvl;
  },
  drops: {},
  addDrop: (value, position) => {
    if (get().drops[`${position.x},${position.y}`])
      value += get().drops[`${position.x},${position.y}`];
    set((state) => ({
      drops: {
        ...state.drops,
        [`${position.x},${position.y}`]: value,
      },
    }));
  },
  removeDrop: (id) => {
    set((state) => ({
      drops: Object.fromEntries(
        Object.entries(state.drops).filter(([key]) => key !== id)
      ),
    }));
  },
}));
