import type { Graphics as PixiGraphics } from "@pixi/graphics";
import { Container, Graphics, useTick, withFilters } from "@pixi/react";
import { useCallback } from "react";
import { colors } from "../assets/colors";
import { MobSizeHalf } from "../constants";
import { isRingIntersectingCircle, mul, normalize, sub } from "../math";
import { useEnemies, usePlayers } from "../store";
import { useWeapons } from "./useWeapons";

const Filters = withFilters(Container, {
  // blur: BlurFilter,
});

const baseRadius = 60 as const;
const baseArea = 5 as const;
const area = 10 as const;

const getScale = (level: number) => 1 + (level - 1) * 0.2;

export function Extinguisher({ id }: { id: string }) {
  const [player, playerPos] = usePlayers((state) => [
    state.players[id],
    state.positions[id],
  ]);
  const [cd, info, level, update] = useWeapons((state) => [
    state.cooldown["extinguisher"],
    state.meta["extinguisher"],
    state.levels["extinguisher"],
    state.updateCooldown,
    // state.resetCooldown,
  ]);
  const [mobPos, hps, updateEnemies, hurts, toggleHurt] = useEnemies(
    (state) => [
      state.positions,
      state.hps,
      state.updateEnemies,
      state.hurts,
      state.toggleHurt,
    ]
  );
  const draw = useCallback(
    (g: PixiGraphics) => {
      const e = colors.elements;
      const scale = getScale(level);
      g.clear();
      g.lineStyle(area * scale, e.iceBlue, Math.sin(cd / 1000) * 0.8 + 0.2);
      g.drawCircle(0, 0, baseRadius * scale);
    },
    [cd, level]
  );
  useTick((_, ticker) => {
    if (cd > 0) {
      update("extinguisher", cd - ticker.deltaMS);
      return;
    }
    // hit collited enemies
    const effectEnemies = Object.keys(mobPos).reduce((keys, key) => {
      const pos = mobPos[key];
      const scale = getScale(level);
      if (
        isRingIntersectingCircle(
          {
            ...playerPos,
            radiusIn: (baseRadius - baseArea) * scale,
            radiusOut: (baseRadius + baseArea) * scale,
          },
          {
            ...pos,
            radius: MobSizeHalf,
          }
        )
      ) {
        keys.push(key);
      }
      return keys;
    }, [] as string[]);
    const next = effectEnemies.map((id) => {
      const hitback = mul(normalize(sub(mobPos[id], playerPos)), info.strength);
      if (!hurts[id]) toggleHurt(id);
      const scale = getScale(level);
      return {
        id,
        hp: hps[id] - info.baseDamage * player.strength * scale,
        velocity: hitback,
      };
    });
    updateEnemies(next);

    update("extinguisher", info.baseDelay * player.cooldown);
  });
  return (
    <Filters>
      <Graphics draw={draw} />
    </Filters>
  );
}
