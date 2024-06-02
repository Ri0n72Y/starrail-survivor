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

const baseRadius = 40 as const;
const baseArea = 5 as const;
const area = 10 as const;

const getScale = (level: number) => 1 + (level - 1) * 0.2;

export function Extinguisher({ id }: { id: string }) {
  const [player, playerPos] = usePlayers((state) => [
    state.players[id],
    state.positions[id],
  ]);
  const [cd, info, level, update, reset] = useWeapons((state) => [
    state.cooldown["extinguisher"],
    state.meta["extinguisher"],
    state.levels["extinguisher"],
    state.updateCooldown,
    state.resetCooldown,
  ]);
  const [mobPos, hps, debuffs, updateEnemy, hurts, toggleHurt] = useEnemies(
    (state) => [
      state.positions,
      state.hps,
      state.debuffs,
      state.updateEnemy,
      state.hurts,
      state.toggleHurt,
    ]
  );
  const draw = useCallback(
    (g: PixiGraphics) => {
      const e = colors.elements;
      g.clear();
      g.lineStyle(area, e.iceBlue, Math.cos(cd / 1000) * 0.2 + 0.6);
      g.drawCircle(0, 0, baseRadius);
    },
    [cd]
  );
  useTick((delta) => {
    if (cd > 0) {
      update("extinguisher", cd - delta * 100);
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
    effectEnemies.forEach((id) => {
      const hitback = mul(normalize(sub(mobPos[id], playerPos)), info.strength);
      if (!hurts[id]) toggleHurt(id);
      updateEnemy({
        id,
        hp: hps[id] - info.baseDamage * player.strength,
        velocity: hitback,
      });
    });
    // console.log("extinguisher", effectEnemies);

    update("extinguisher", info.baseDelay * player.cooldown);
  });
  return (
    <Filters>
      <Graphics draw={draw} />
    </Filters>
  );
}
