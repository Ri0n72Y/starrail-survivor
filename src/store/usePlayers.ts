import { create } from "zustand";
import { v4 } from "uuid";

interface Character {
  id: string;
  name: string;
  hp: number;
  speed: number;
}
interface Player {
  // metadata
  id: string;
  charactorId: string;
  name: string;
  // stats
  exp: number;
  hp: number;
  maxHpScale: number;
  strength: number;
  cooldown: number;
  speedScale: number;
}

interface Players {
  characters: Record<string, Character>;
  loadCharacters: () => Promise<void>;
  players: Record<string, Player>;
  updatePlayerHp: (id: string, hp: number) => void;
  positions: Record<string, { x: number; y: number }>;
  setPosition: (id: string, pos: { x: number; y: number }) => void;
  addPlayer(player: {
    charactorId: string;
    pos?: { x: number; y: number };
  }): void;
  removePlayer(id: string): void;
}

export const usePlayers = create<Players>()((set, get) => ({
  characters: {},
  loadCharacters: async () => {
    const res = await fetch("/data/characters.json");
    const characters = (await res.json()) as Character[];
    set({ characters: Object.fromEntries(characters.map((v) => [v.id, v])) });
  },
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
  addPlayer: ({ charactorId, pos }) => {
    const id = v4();
    const character = get().characters[charactorId];
    console.log(character);
    set((state) => ({
      players: {
        ...state.players,
        [id]: {
          id,
          charactorId,
          name: character.name,
          exp: 0,
          hp: character.hp,
          maxHpScale: 1,
          strength: 1,
          cooldown: 1,
          speedScale: 1,
        },
      },
      positions: {
        ...state.positions,
        [id]: pos ?? { x: 0, y: 0 },
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
  setHurt: (id, value) => {
    set((state) => ({ ...state, [id]: value }));
  },
}));
