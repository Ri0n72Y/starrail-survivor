import { create } from "zustand";

export type DebuffType = "slow" | "freeze" | "burn";

interface EnemyType {
  id: string;
  name: string;
  hp: number;
  speed: number;
  damege: number;
  exp: number;
  move: "player" | "random" | "static";
  direction?: { x: number; y: number };
}
interface EnemyUpdate {
  id: string;
  hp?: number;
  velocity?: { x: number; y: number };
  position?: { x: number; y: number };
  debuffs?: DebuffType[];
}
interface EnemyCreate extends EnemyUpdate {
  type: string;
}
interface Enemies {
  enemyMeta: Record<string, EnemyType>;
  loadEnemyMeta: () => void;
  hps: Record<string, number>;
  hurts: Record<string, boolean>;
  toggleHurt: (id: string) => void;
  /** @description mob type key of metadata */
  types: Record<string, string>;
  velocitys: Record<string, { x: number; y: number }>;
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
  enemyMeta: {
    test: {
      id: "test",
      name: "Test Mob",
      hp: 10,
      speed: 5,
      damege: 1,
      move: "player",
      exp: 1,
    },
  },
  loadEnemyMeta: () => {},
  hps: {},
  hurts: {},
  toggleHurt: (id) => {
    set((state) => ({
      hurts: { ...state.hurts, [id]: !state.hurts[id] },
    }));
  },
  debuffs: {},
  types: {},
  velocitys: {},
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
      velocitys: { ...get().velocitys, ...newVelocitys },
      positions: { ...get().positions, ...newPositions },
      types: { ...get().types, ...newTypes },
    });
  },
  updateEnemy: ({ id, hp, velocity, position, debuffs }) => {
    const rest = {
      ...(hp !== undefined ? { hps: { ...get().hps, [id]: hp } } : {}),
      ...(velocity
        ? { velocitys: { ...get().velocitys, [id]: velocity } }
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
      newVelocitys[enemy.id] = enemy.velocity ?? get().velocitys[enemy.id];
      newPositions[enemy.id] = enemy.position ?? get().positions[enemy.id];
      debuffs[enemy.id] = enemy.debuffs ?? get().debuffs[enemy.id];
    });
    set({
      hps: { ...get().hps, ...newHps },
      debuffs: { ...get().debuffs, ...debuffs },
      velocitys: { ...get().velocitys, ...newVelocitys },
      positions: { ...get().positions, ...newPositions },
    });
  },
  killEnemy: (id) => {
    delete get().hps[id];
    delete get().velocitys[id];
    delete get().positions[id];
    delete get().types[id];
  },
  removeEnemy: (id) => {
    delete get().hps[id];
    delete get().velocitys[id];
    delete get().positions[id];
    delete get().types[id];
  },
}));
