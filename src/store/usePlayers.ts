import { create } from "zustand";
import { v4 } from "uuid";
import { useGame } from "../store";
import { useExp } from "./useExp";

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
  maxHpScale: number;
  strength: number;
  cooldown: number;
  speedScale: number;
  extraProjectiles: number;
  collectingRange: number;
}

interface Players {
  characters: Record<string, Character>;
  loadCharacters: () => Promise<void>;
  players: Record<string, Player>;
  playerHp: Record<string, number>;
  updatePlayerHp: (ids: string[], hps: number[]) => void;
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
  playerHp: {},
  updatePlayerHp: (ids, hps) => {
    set((state) => ({
      playerHp: {
        ...state.playerHp,
        ...Object.fromEntries(ids.map((id, i) => [id, hps[i]])),
      },
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
    //TODO: remove testing code
    useGame.getState().setClientPlayerId(id);
    const newPlayer: Player = {
      id,
      charactorId,
      name: character.name,
      maxHpScale: 1,
      strength: 1,
      cooldown: 1,
      speedScale: 1,
      extraProjectiles: 0,
      collectingRange: 1,
    };
    useExp.getState().updatePlayerExp([id], [0]);
    set((state) => ({
      players: {
        ...state.players,
        [id]: newPlayer,
      },
      positions: {
        ...state.positions,
        [id]: pos ?? { x: 0, y: 0 },
      },
      playerHp: {
        ...state.playerHp,
        [id]: character.hp,
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
