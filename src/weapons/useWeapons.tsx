import { create } from "zustand";

export type WeaponType =
  | "extinguisher"
  | "arrow"
  | "thunder"
  | NonNullable<string>;

interface Weapon {
  id: WeaponType;
  baseDamage: number;
  /** @description cooldown in ms */
  baseDelay: number;
  /** @description acceleration of push out */
  strength: number;
}

interface WeaponsActivation {
  meta: Record<WeaponType, Weapon>;
  loadWeapon: () => Promise<void>;
  levels: Record<WeaponType, number>;
  upgrade: (weapon: WeaponType) => void;
  /** @description cooldown in ms */
  cooldown: Record<WeaponType, number>;
  updateCooldown: (delta: number) => void;
  setCooldown: (weapon: WeaponType, value: number) => void;
}

export const useWeapons = create<WeaponsActivation>()((set, get) => ({
  meta: {},
  levels: {},
  cooldown: {},
  loadWeapon: async () => {
    try {
      const text = await fetch("/data/weapons.json");
      const json = (await text.json()) as Weapon[];
      const meta = {} as Record<WeaponType, Weapon>;
      const levels = {} as Record<WeaponType, number>;
      const cooldown = {} as Record<WeaponType, number>;
      json.forEach((weapon) => {
        meta[weapon.id] = weapon;
        levels[weapon.id] = 0;
        cooldown[weapon.id] = 0;
      });
      set({ meta, levels, cooldown });
    } catch (error) {
      console.log(error);
    }
  },
  updateCooldown: (delta) => {
    const keys = Object.keys(get().cooldown);
    const cooldown = {} as Record<WeaponType, number>;
    keys.forEach((key) => {
      cooldown[key] =
        get().cooldown[key] > 0 ? Math.max(get().cooldown[key] - delta, 0) : 0;
    });
    set({ cooldown });
  },
  setCooldown: (weapon, value) => {
    set((weapons) => ({
      cooldown: { ...weapons.cooldown, [weapon]: value },
    }));
  },
  upgrade: (weapon) => {
    set((weapons) => ({
      levels: { ...weapons.levels, [weapon]: weapons.levels[weapon] + 1 },
    }));
  },
}));
