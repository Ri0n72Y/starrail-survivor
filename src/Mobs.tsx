import { Container, Sprite, useTick, withFilters } from "@pixi/react";
import { useCamera, useEnemies } from "./store";
import { add, distance, mul, normalize, sub } from "./math";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { useState } from "react";
import {
  FR_SCALE as scale,
  MOB_MAXIMUM as maximum,
  ClinetWidth,
  ClinetHeight,
} from "./constants";
import { v4 as uuid } from "uuid";
import useInterval from "use-interval";

const Filters = withFilters(Container, {
  adjust: AdjustmentFilter,
});

const filters = {
  red: { brightness: 1, red: 2, blue: 0.5, green: 0.5 },
  normal: { brightness: 0.8, red: 1, blue: 1, green: 1 },
} as const;

const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
export function Mobs() {
  const [enemies, add] = useEnemies((state) => [state.hps, state.addEnemies]);
  const [x, y] = useCamera((state) => [state.x, state.y]);
  useInterval(() => {
    if (Object.keys(enemies).length < maximum) {
      const sample = { hp: 10, type: "test" };
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
  // const players = usePlayers((state) => state.positions);
  const [hp, pos, type, elites, update, kill, remove] = useEnemies((state) => [
    state.hps[id],
    state.positions[id],
    state.types[id],
    state.elites,
    state.updateEnemy,
    state.killEnemy,
    state.removeEnemy,
  ]);
  const meta = useEnemies((state) => state.enemyMeta[type]);
  useTick((delta) => {
    if (hp <= 0) {
      kill(id);
      return;
    }
    // let minDist = Infinity;
    // let targetPos = pos;
    // for (const target of Object.values(players)) {
    //   const dist = distance(pos, target);
    //   if (dist < minDist) {
    //     minDist = dist;
    //     targetPos = target;
    //   }
    // }
    const targetPos = { x, y };
    const minDist = distance(pos, targetPos);
    if (minDist > 500 && !elites.includes(id)) {
      remove(id);
      return;
    }
    if (minDist < 10) {
      update({ id, hp: 0, position: pos });
      setIsHurt(true);
      return;
    }
    const dir = normalize(sub(targetPos, pos));
    const speed = meta.speed * delta * scale;
    const velocity = mul(dir, speed);
    update({ id, hp, position: add(pos, velocity) });
  });
  return (
    <Filters adjust={isHurt ? filters.red : filters.normal}>
      <Sprite
        image={bunnyUrl}
        x={pos.x - x + ClinetWidth * 0.5}
        y={pos.y - y + ClinetHeight * 0.5}
      />
    </Filters>
  );
}
