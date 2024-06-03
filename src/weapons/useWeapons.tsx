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
  updateCooldown: (weapon: WeaponType, time: number) => void;
  resetCooldown: (weapon: WeaponType) => void;
}

export const useWeapons = create<WeaponsActivation>()((set) => ({
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
  updateCooldown: (weapon, time) => {
    set((weapons) => ({
      ...weapons,
      cooldown: { ...weapons.cooldown, [weapon]: time },
    }));
  },
  resetCooldown: (weapon) => {
    set((weapons) => ({
      ...weapons,
      cooldown: { ...weapons.cooldown, [weapon]: 0 },
    }));
  },
  upgrade: (weapon) => {
    set((weapons) => ({
      levels: { ...weapons.levels, [weapon]: weapons.levels[weapon] + 1 },
    }));
  },
}));
