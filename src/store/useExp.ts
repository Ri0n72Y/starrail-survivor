import { create } from "zustand";

interface Props {
  playerExp: Record<string, number>;
  updatePlayerExp: (ids: string[], exps: number[]) => void;
  drops: Record<string, number>;
  addDrop: (value: number, position: { x: number; y: number }) => void;
  removeDrop: (id: string) => void;
}
export const useExp = create<Props>()((set, get) => ({
  playerExp: {},
  updatePlayerExp: (ids, exps) => {
    set((state) => ({
      playerExp: {
        ...state.playerExp,
        ...Object.fromEntries(
          ids.map((id, i) => [id, (state.playerExp[id] ?? 0) + exps[i]])
        ),
      },
    }));
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
