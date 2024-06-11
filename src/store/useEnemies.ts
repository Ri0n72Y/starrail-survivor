import { create } from "zustand";
import { useExp } from "./useExp";

export type DebuffType = "slow" | "freeze" | "burn";

interface EnemyType {
  id: string;
  name: string;
  hp: number;
  speed: number;
  damege: number;
  exp: number;
  move: "player" | "random" | "static";
  image: string;
  direction?: { x: number; y: number };
}
interface EnemyUpdate {
  id: string;
  hp?: number;
  extraVelocity?: { x: number; y: number };
  position?: { x: number; y: number };
  debuffs?: DebuffType[];
}
interface EnemyCreate extends EnemyUpdate {
  type: string;
}
interface Enemies {
  enemyMeta: Record<string, EnemyType>;
  loadEnemyMeta: () => Promise<void>;
  hps: Record<string, number>;
  hurts: Record<string, boolean>;
  toggleHurt: (id: string) => void;
  /** @description mob type key of metadata */
  types: Record<string, string>;
  extraVelocities: Record<string, { x: number; y: number }>;
  positions: Record<string, { x: number; y: number }>;
  debuffs: Record<string, DebuffType[]>;
  elites: string[];
  addEnemies: (enemies: EnemyCreate[]) => void;
  updateEnemy: (enemy: EnemyUpdate) => void;
  updateEnemies: (enemies: EnemyUpdate[]) => void;
  killEnemy: (id: string) => void;
  removeEnemy: (id: string) => void;
}

export const useEnemies = create<Enemies>()((set, get) => ({
  enemyMeta: {},
  loadEnemyMeta: async () => {
    try {
      const text = await fetch("/data/enemies.json");
      const json = (await text.json()) as EnemyType[];
      set({ enemyMeta: Object.fromEntries(json.map((v) => [v.id, v])) });
    } catch (error) {
      console.log(error);
    }
  },
  hps: {},
  hurts: {},
  toggleHurt: (id) => {
    set((state) => ({
      hurts: { ...state.hurts, [id]: !state.hurts[id] },
    }));
  },
  debuffs: {},
  types: {},
  extraVelocities: {},
  positions: {},
  elites: [],
  addEnemies: (enemies) => {
    const newHps: Record<string, number> = {};
    const newHurts: Record<string, boolean> = {};
    const newVelocitys: Record<string, { x: number; y: number }> = {};
    const newPositions: Record<string, { x: number; y: number }> = {};
    const newTypes: Record<string, string> = {};
    const debuffs: Record<string, DebuffType[]> = {};
    enemies.forEach((enemy) => {
      newHps[enemy.id] = enemy.hp ?? 0;
      newHurts[enemy.id] = false;
      newVelocitys[enemy.id] = { x: 0, y: 0 };
      newPositions[enemy.id] = enemy.position ?? { x: 0, y: 0 };
      newTypes[enemy.id] = enemy.type;
      debuffs[enemy.id] = [];
    });
    set({
      hps: { ...get().hps, ...newHps },
      hurts: { ...get().hurts, ...newHurts },
      debuffs: { ...get().debuffs, ...debuffs },
      extraVelocities: { ...get().extraVelocities, ...newVelocitys },
      positions: { ...get().positions, ...newPositions },
      types: { ...get().types, ...newTypes },
    });
  },
  updateEnemy: ({ id, hp, extraVelocity: velocity, position, debuffs }) => {
    const rest = {
      ...(hp !== undefined ? { hps: { ...get().hps, [id]: hp } } : {}),
      ...(velocity
        ? { velocitys: { ...get().extraVelocities, [id]: velocity } }
        : {}),
      ...(position
        ? { positions: { ...get().positions, [id]: position } }
        : {}),
      ...(debuffs ? { debuffs: { ...get().debuffs, [id]: debuffs } } : {}),
    };
    set(rest);
  },
  updateEnemies: (enemies) => {
    const newHps: Record<string, number> = {};
    const newVelocitys: Record<string, { x: number; y: number }> = {};
    const newPositions: Record<string, { x: number; y: number }> = {};
    const debuffs: Record<string, DebuffType[]> = {};
    enemies.forEach((enemy) => {
      newHps[enemy.id] = enemy.hp ?? get().hps[enemy.id];
      newVelocitys[enemy.id] =
        enemy.extraVelocity ?? get().extraVelocities[enemy.id];
      newPositions[enemy.id] = enemy.position ?? get().positions[enemy.id];
      debuffs[enemy.id] = enemy.debuffs ?? get().debuffs[enemy.id];
    });
    set({
      hps: { ...get().hps, ...newHps },
      debuffs: { ...get().debuffs, ...debuffs },
      extraVelocities: { ...get().extraVelocities, ...newVelocitys },
      positions: { ...get().positions, ...newPositions },
    });
  },
  killEnemy: (id) => {
    delete get().hps[id];
    delete get().extraVelocities[id];
    const pos = get().positions[id];
    delete get().positions[id];
    const info = get().enemyMeta[get().types[id]];
    delete get().types[id];
    delete get().debuffs[id];
    delete get().hurts[id];

    if (info && pos) useExp.getState().addDrop(info.exp, pos);
  },
  removeEnemy: (id) => {
    delete get().hps[id];
    delete get().extraVelocities[id];
    delete get().positions[id];
    delete get().types[id];
    delete get().debuffs[id];
    delete get().hurts[id];
  },
}));
