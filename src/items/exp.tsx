import { Sprite, useTick } from "@pixi/react";
import { useMemo } from "react";
import { useExp } from "../store/useExp";
import {
  ClinetHeight,
  ClinetWidth,
  ItemSize,
  MobSizeHalf,
  baseCollectionRange,
} from "../constants";
import { useCamera, usePlayers } from "../store";
import { distance, normalize } from "../math";
import { create } from "zustand";

export function ExpSystem() {
  return (
    <>
      <ExpCollector />
      <StaticExps />
      <FlyingExps />
    </>
  );
}

const MaxFlyingSpeed = 500 as const;

interface ExpProps {
  value: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}
const useFlyingExp = create<Record<string, (ExpProps | null)[]>>()(() => ({}));
function collect(pid: string, exp: ExpProps) {
  const exps = useFlyingExp.getState()[pid] ?? [];
  exps.push(exp);
  useFlyingExp.setState({ [pid]: exps });
}

function ExpCollector() {
  const [pInfo, pPos] = usePlayers((state) => [state.players, state.positions]);
  const [pKeys, pRange] = useMemo(() => {
    const pKeys = Object.keys(pInfo);
    const pRange = Object.fromEntries(
      pKeys.map((id) => [id, pInfo[id].collectingRange * baseCollectionRange])
    );
    return [pKeys, pRange];
  }, [pInfo]);
  const [data, remove] = useExp((state) => [state.drops, state.removeDrop]);
  useTick(() => {
    const exps = Object.keys(data);
    for (const id of exps) {
      const [x, y] = id.split(",").map(Number) as [number, number];
      for (const pid of pKeys) {
        const dist = distance({ x, y }, pPos[pid]);
        if (dist < pRange[pid]) {
          collect(pid, { value: data[id], x, y, vx: 0, vy: 0 });
          remove(id);
        }
      }
    }
  });
  return null;
}

function FlyingExps() {
  const exps = useFlyingExp();
  const pPos = usePlayers((state) => state.positions);
  useTick((delta) => {
    for (const pid of Object.keys(exps)) {
      let gainExp = 0;
      const list = exps[pid] ?? [];
      exps[pid].forEach((exp, i) => {
        if (!exp) return;
        let { x, y, vx, vy } = exp;
        const value = exp.value;
        const dist = distance({ x, y }, pPos[pid]);
        if (dist < MobSizeHalf) {
          // remove the exp
          list[i] = null;
          gainExp += value;
        } else {
          const velocity = normalize({
            x: pPos[pid].x - x,
            y: pPos[pid].y - y,
          });
          // no initial velocity
          if (vx === 0 && vy === 0) {
            vx = velocity.x * 10;
            vy = velocity.y * 10;
            list[i] = { value, x, y, vx, vy };
          } else {
            x = x + vx;
            y = y + vy;
            vx = Math.min(vx + velocity.x * 5, MaxFlyingSpeed) * delta * 0.8;
            vy = Math.min(vy + velocity.y * 5, MaxFlyingSpeed) * delta * 0.8;
            list[i] = { value, x, y, vx, vy };
          }
        }
      });
      useFlyingExp.setState({ [pid]: list.filter((exp) => exp) });
      if (gainExp) useExp.getState().updatePlayerExp([pid], [gainExp]);
    }
  });
  return Object.values(exps)
    .map((expList) =>
      expList.map((exp) => (
        <ExpItem
          key={`${exp?.x},${exp?.y}`}
          pos={{ x: exp?.x ?? 0, y: exp?.y ?? 0 }}
          value={exp?.value ?? 0}
        />
      ))
    )
    .flat();
}

function StaticExps() {
  const [data] = useExp((state) => [state.drops]);
  return Object.keys(data).map((id) => {
    const [x, y] = id.split(",").map(Number) as [number, number];
    return <ExpItem key={id} pos={{ x, y }} value={data[id] ?? 0} />;
  });
}

function ExpItem({
  pos,
  value,
}: {
  pos: { x: number; y: number };
  value: number;
}) {
  const [x, y] = useCamera((state) => [state.x, state.y]);
  const posX = pos.x - x + ClinetWidth * 0.5;
  const posY = pos.y - y + ClinetHeight * 0.5;
  const img = useMemo(() => {
    if (!value) return "";
    if (value < 10) return "exp-1-item.png";
    if (value < 50) return "exp-2-item.png";
    return "exp-3-item.png";
  }, [value]);
  // console.log(posX, posY);
  return (
    <Sprite
      image={`/assets/${img}`}
      width={ItemSize}
      height={ItemSize}
      x={posX}
      y={posY}
      anchor={0.5}
    />
  );
}
