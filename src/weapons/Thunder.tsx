import { GlowFilter } from "@pixi/filter-glow";
import type { Graphics as PixiGraphics } from "@pixi/graphics";
import { Container, Graphics, useTick, withFilters } from "@pixi/react";
import { useCallback, useMemo, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
import { colors } from "../assets/colors";
import { add, distance, mul, normalize, orthogonal, sub, vec2 } from "../math";
import { useCamera, useEnemies, usePlayers } from "../store";
import { EnemyPositionInfo, closestNEnemies } from "../utils";
import { useWeapons } from "./useWeapons";

const Filters = withFilters(Container, {
  GlowFilter,
});

const counts = [3, 3, 3, 5, 5, 5, 5, 7];
const damage = [4, 8, 12, 12, 16, 20, 24, 24];
const maxDistance = 200 as const;

export function Thunder({ playerId }: { playerId: string }) {
  const [player, playerPos] = usePlayers((state) => [
    state.players[playerId],
    state.positions[playerId],
  ]);
  const [positions] = useEnemies((state) => [state.positions]);
  const [cd, info, level, update] = useWeapons((state) => [
    state.cooldown["thunder"],
    state.meta["thunder"],
    state.levels["thunder"],
    state.setCooldown,
  ]);
  const [projectiles, setProjectiles] = useState<Record<string, Props>>({});
  useTick(() => {
    if (cd > 0) return;
    // create thunder projectiles
    const count = counts[level] + player.extraProjectiles;
    const res: EnemyPositionInfo[] = [];
    for (let i = 0; i < count; i++) {
      const includeKeys = res.map((v) => v.id);
      const availables = Object.entries(positions).filter(
        (v) => !includeKeys.includes(v[0])
      );
      const target = closestNEnemies(
        i === 0 ? playerPos : res[i - 1].point,
        Object.fromEntries(availables),
        1,
        maxDistance
      );
      if (!target || target.length === 0) break;
      res.push(target[0]);
    }
    const targets = res.map((v) => v.id);
    if (targets.length > 0) {
      setProjectiles((projectiles) => {
        const id = uuid();
        return {
          ...projectiles,
          [id]: {
            id,
            playerId,
            targets,
            damage: damage[level] * info.baseDamage,
            onEnd: () => {
              delete projectiles[id];
              setProjectiles({ ...projectiles });
            },
          },
        };
      });
    }
    update("thunder", info.baseDelay * player.cooldown);
  });
  return (
    <>
      {Object.values(projectiles).map((p) => (
        <ThunderProjectile {...p} key={p.id} />
      ))}
    </>
  );
}

interface Props {
  id: string;
  playerId: string;
  targets: string[];
  damage: number;
  onEnd: () => void;
}
const animationDuration = 200 as const;
function ThunderProjectile({ id, playerId, targets, damage, onEnd }: Props) {
  const playerPos = usePlayers((state) => state.positions[playerId]);
  const [enemies, positions, update] = useEnemies((state) => [
    state.hps,
    state.positions,
    state.updateEnemy,
  ]);
  const [hurt, toggleHurt] = useEnemies((state) => [
    state.hurts,
    state.toggleHurt,
  ]);
  const [link, setLink] = useState<[string, string][]>([]);
  const info = useWeapons((state) => state.meta["thunder"]);

  const [damageIndex, setDamageIndex] = useState(0);

  const [animationIndex, setAnimationIndex] = useState(0);
  const frames = useMemo(
    () =>
      new Array<number>(targets.length)
        .fill(0)
        .map((_, i) => i * animationDuration * 0.5),
    [targets.length]
  );

  const timer = useRef(0);

  useTick((_, ticker) => {
    if (timer.current >= targets.length * animationDuration) return;
    timer.current = timer.current + ticker.deltaMS;
    // start to draw animation
    if (timer.current >= frames[animationIndex]) {
      const from =
        animationIndex === 0 ? playerId : targets[animationIndex - 1];
      const target = targets[animationIndex];
      if (!hurt[target]) toggleHurt(target);
      setLink((v) => [...v, [from, target]]);
      setAnimationIndex(animationIndex + 1);
    }

    // deal damage
    if (timer.current >= frames[damageIndex] + animationDuration) {
      const target = targets[damageIndex];
      const hitDirection = sub(positions[target], playerPos);
      const hitback = mul(normalize(hitDirection), info.strength);
      update({
        id: target,
        hp: enemies[target] - damage * 0.5 ** damageIndex,
        extraVelocity: hitback,
      });
      setLink((v) => v.filter((v) => v[1] !== target));
      setDamageIndex(damageIndex + 1);
    }

    // end
    if (damageIndex >= targets.length) {
      console.log("end");
      setLink([]);
      onEnd();
    }
  });

  return (
    <>
      {link.map(([from, target], i) => (
        <ThunderProjectileDraw
          key={`${id}-${target}`}
          startX={i === 0 ? playerPos.x : positions[from].x}
          startY={i === 0 ? playerPos.y : positions[from].y}
          endX={positions[target].x}
          endY={positions[target].y}
        />
      ))}
    </>
  );
}

const randomScope = 10 as const;
const segmentLength = 20 as const;

const color = colors.weapons.thunder;
interface LightningProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}
function ThunderProjectileDraw({ startX, startY, endX, endY }: LightningProps) {
  const [x, y] = useCamera((state) => [state.x, state.y]);
  const draw = useCallback(
    (g: PixiGraphics) => {
      const line1 = getLightningPoints(
        { x: startX - x, y: startY - y },
        { x: endX - x, y: endY - y },
        segmentLength,
        randomScope
      );
      g.clear();
      g.lineStyle(2, color.a, 1);
      g.moveTo(line1[0].x, line1[0].y);
      line1.forEach((point) => g.lineTo(point.x, point.y));
      const line2 = getLightningPoints(
        { x: startX - x, y: startY - y },
        { x: endX - x, y: endY - y },
        segmentLength,
        randomScope
      );
      g.lineStyle(3, color.b, 0.8);
      g.moveTo(line2[0].x, line2[0].y);
      line2.forEach((point) => g.lineTo(point.x, point.y));
    },
    [endX, endY, startX, startY, x, y]
  );
  return (
    <Filters GlowFilter={{ color: color.g }}>
      <Graphics draw={draw} />
    </Filters>
  );
}

function getLightningPoints(
  start: vec2,
  end: vec2,
  segmentLength: number,
  spread: number
) {
  const d = distance(start, end);
  const segments = Math.floor(d / segmentLength);
  const points: vec2[] = [start];
  for (let index = 0; index < segments; index++) {
    const endPoint = getSegmentEnd(start, end, segmentLength, index);
    const offset = Math.random() * (2 * spread) - spread;
    const orth = orthogonal(normalize(sub(endPoint, start)));
    points.push(add(endPoint, mul(orth, offset)));
  }
  points.push(end);
  return points;
}

function getSegmentEnd(start: vec2, end: vec2, length: number, index: number) {
  const segLength = length * index;
  const ratio = segLength / distance(start, end);
  return {
    x: start.x + (end.x - start.x) * ratio,
    y: start.y + (end.y - start.y) * ratio,
  };
}
