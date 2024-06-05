import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { Container, Sprite, useTick, withFilters } from "@pixi/react";
import { useState } from "react";
import useInterval from "use-interval";
import { v4 as uuid } from "uuid";
import {
  ClinetHeight,
  ClinetWidth,
  MobSize,
  MobSizeHalf,
  PlayerMinDistace,
  MOB_MAXIMUM as maximum,
  FR_SCALE as scale,
} from "./constants";
import { DebugCollision } from "./debug/collision";
import { add, distance, mag, mul, normalize, sub } from "./math";
import {
  useCamera,
  useEnemies,
  usePlayerHurt,
  usePlayers,
  useScore,
} from "./store";
import { useDifficulty } from "./store/useDifficulty";

const Filters = withFilters(Container, {
  adjust: AdjustmentFilter,
});

const filters = {
  red: { brightness: 1.2, red: 2, blue: 0.5, green: 0.5 },
  normal: { brightness: 1, red: 1, blue: 1, green: 1 },
} as const;

export function Mobs() {
  const [enemies, add] = useEnemies((state) => [state.hps, state.addEnemies]);
  const [x, y] = useCamera((state) => [state.x, state.y]);
  const score = useScore((state) => state.score);
  // spawn
  useInterval(() => {
    if (Object.keys(enemies).length < maximum) {
      const baseHp = Math.round(score / 50);
      const sample = {
        hp: baseHp * 6 + Math.round(Math.random() * baseHp * 4),
        type: "stone",
      };
      const res = new Array(maximum - Object.keys(enemies).length)
        .fill(sample)
        .map((s) => {
          const vOrH = Math.random() > 0.5;
          const sOrL = Math.random() > 0.5;
          let spawnX = 0,
            spawnY = 0;
          if (vOrH) {
            // spawn on vertical axis
            spawnY =
              y - ClinetHeight * 0.5 + Math.random() * ClinetHeight + 100;
            if (sOrL) spawnX = x - ClinetWidth / 2 - 50; // small direction
            else spawnX = x + ClinetWidth / 2 + 50;
          } else {
            // spawn on horizontal axis
            spawnX = x - ClinetWidth * 0.5 + Math.random() * ClinetWidth + 100;
            if (sOrL) spawnY = y - ClinetHeight / 2 - 50; // small direction
            else spawnY = y + ClinetHeight / 2 + 50;
          }
          return {
            ...s,
            position: {
              x: spawnX,
              y: spawnY,
            },
            id: uuid(),
          };
        });
      add(res);
    }
  }, 1000);
  return (
    <>
      {Object.keys(enemies).map((id) => (
        <Mob key={id} id={id} />
      ))}
    </>
  );
}

function Mob({ id }: { id: string }) {
  const [isHurt, setIsHurt] = useState(false);
  const [x, y] = useCamera((state) => [state.x, state.y]);
  const [players] = usePlayers((state) => [state.positions]);
  const [hurts, setHurt] = usePlayerHurt((state) => [
    state, // TODO: remove hard value
    state.setHurt,
  ]);
  const [hp, velocity, pos, type, elites, update, kill, remove, info] =
    useEnemies((state) => [
      state.hps[id],
      state.extraVelocities[id],
      state.positions[id],
      state.types[id],
      state.elites,
      state.updateEnemy,
      state.killEnemy,
      state.removeEnemy,
      state.enemyMeta,
    ]);
  const [hurt, toggleHurt] = useEnemies((state) => [
    state.hurts[id],
    state.toggleHurt,
  ]);
  const setScore = useScore((state) => state.setScore);
  const speedScale = useDifficulty((state) => state.speed);
  const meta = useEnemies((state) => state.enemyMeta[type]);
  useTick((delta) => {
    if (hp <= 0) {
      kill(id);
      setScore((s) => s + 5);
      return;
    }
    // multiplayer support
    let minDist = Infinity;
    let targetPos = pos;
    let player = "";
    for (const id of Object.keys(players)) {
      const target = players[id];
      const dist = distance(pos, target);
      if (dist < minDist) {
        minDist = dist;
        targetPos = target;
        player = id;
      }
    }
    if (minDist > 500 && !elites.includes(id)) {
      remove(id);
      return;
    }
    if (hurt && !isHurt) {
      setIsHurt(true);
      setTimeout(() => {
        setIsHurt(false);
        toggleHurt(id);
      }, 150);
    }
    // hit part
    if (minDist < MobSizeHalf) {
      if (!hurts[player]) {
        setHurt(player, info[type].damege);
      }
    }

    // update velocity
    const dir = normalize(sub(targetPos, pos));
    const speed = meta.speed * delta * scale * speedScale;
    const velo = mul(dir, speed);
    const magnitude = mag(velocity);
    const displacement = magnitude > 0 ? add(velo, velocity) : velo;

    // update velocity
    if (magnitude > 0.02) {
      update({ id, extraVelocity: mul(velocity, 0.8) });
    } else if (magnitude < 0.02 && magnitude > 0) {
      update({ id, extraVelocity: { x: 0, y: 0 } });
    }

    // TODO: update collision with other mobs
    let position = add(pos, displacement);
    if (distance(targetPos, position) < MobSizeHalf + PlayerMinDistace) {
      position = pos;
    }
    // update position
    update({
      id,
      position,
    });
  });
  const posX = pos.x - x + ClinetWidth * 0.5;
  const posY = pos.y - y + ClinetHeight * 0.5;
  return (
    <Filters adjust={isHurt ? filters.red : filters.normal}>
      <Sprite
        image={`/assets/${info[type].image}`}
        width={MobSize}
        height={MobSize}
        x={posX}
        y={posY}
        anchor={0.5}
      />
      <DebugCollision x={posX} y={posY} color={0xff0000} />
    </Filters>
  );
}
