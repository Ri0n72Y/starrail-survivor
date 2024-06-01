import { create } from "zustand";

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
  id: string;
  name: string;
  score: number;
  hp: number;
  maxHp: number;
  speed: number;
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
  hp: number;
  position: { x: number; y: number };
}
interface EnemyCreate extends EnemyUpdate {
  type: string;
}
interface Enemies {
  enemyMeta: Record<string, EnemyType>;
  loadEnemyMeta: () => void;
  hps: Record<string, number>;
  types: Record<string, string>;
  positions: Record<string, { x: number; y: number }>;
  addEnemies: (enemies: EnemyCreate[]) => void;
  updateEnemy: (enemy: EnemyUpdate) => void;
  updateEnemies: (enemies: EnemyUpdate[]) => void;
  killEnemy: (id: string) => void;
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
  types: {},
  positions: {},
  addEnemies: (enemies) => {
    const newHps: Record<string, number> = {};
    const newPositions: Record<string, { x: number; y: number }> = {};
    const newTypes: Record<string, string> = {};
    enemies.forEach((enemy) => {
      newHps[enemy.id] = enemy.hp;
      newPositions[enemy.id] = enemy.position;
      newTypes[enemy.id] = enemy.type;
    });
    set({
      hps: { ...get().hps, ...newHps },
      positions: { ...get().positions, ...newPositions },
      types: { ...get().types, ...newTypes },
    });
  },
  updateEnemy: ({ id, hp, position }) => {
    set((state) => ({
      hps: { ...state.hps, [id]: hp },
      positions: { ...state.positions, [id]: position },
    }));
  },
  updateEnemies: (enemies) => {
    // TODO: hp < 0 remove
    set((state) => {
      const newPositions = { ...state.positions };
      enemies.forEach((enemy) => {
        newPositions[enemy.id] = enemy.position;
      });
      return { positions: newPositions };
    });
  },
  killEnemy: (id) => {
    delete get().hps[id];
    delete get().positions[id];
    delete get().types[id];
  },
}));
