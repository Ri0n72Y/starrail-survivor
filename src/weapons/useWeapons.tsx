import { create } from "zustand";

export type WeaponType = "extinguisher" | "arrow";

interface Weapon {
  id: WeaponType;
  baseDamage: number;
  /** @description cooldown in ms */
  baseDelay: number;
  /** @description acceleration of push out */
  strength: number;
}

const extinguisher: Weapon = {
  id: "extinguisher",
  baseDamage: 10,
  baseDelay: 1000,
  strength: 5,
};

const arrow: Weapon = {
  id: "arrow",
  baseDamage: 5,
  baseDelay: 1000,
  strength: 10,
};

const meta = { extinguisher, arrow };

interface WeaponsActivation {
  meta: Record<WeaponType, Weapon>;
  levels: Record<WeaponType, number>;
  upgrade: (weapon: WeaponType) => void;
  /** @description cooldown in ms */
  cooldown: Record<WeaponType, number>;
  updateCooldown: (weapon: WeaponType, time: number) => void;
  resetCooldown: (weapon: WeaponType) => void;
}

export const useWeapons = create<WeaponsActivation>()((set) => ({
  meta,
  levels: { extinguisher: 1, arrow: 0 },
  cooldown: { extinguisher: 0, arrow: 0 },
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
