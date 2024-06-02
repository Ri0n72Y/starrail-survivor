import "@pixi/events";
import { AdjustmentFilter } from "@pixi/filter-adjustment";
import { Container, Sprite, useTick, withFilters } from "@pixi/react";
import { useState } from "react";
import {
  ClinetHeight,
  ClinetWidth,
  MobSize,
  FR_SCALE as scale,
} from "./constants";
import { useInput } from "./keyboard";
import { add, mul, normalize } from "./math";
import { useCamera, usePlayers } from "./store";
import { DebugCollision } from "./debug/collision";

const Filters = withFilters(Container, {
  adjust: AdjustmentFilter,
});

const filters = {
  red: { brightness: 1.2, red: 2, blue: 0.5, green: 0.5 },
  normal: { brightness: 1, red: 1, blue: 1, green: 1 },
} as const;

const bunnyUrl = "/assets/chara.png";
export function Player({ id }: { id: string }) {
  const input = useInput();
  const [isHurt, setIsHurt] = useState(false);
  const [player, pos, setPos] = usePlayers((state) => [
    state.players[id],
    state.positions[id],
    state.setPosition,
  ]);
  const [setX, setY] = useCamera((state) => [state.setX, state.setY]);
  useTick((delta) => {
    let x = 0;
    let y = 0;
    if (input.moveLeft) x -= 1;
    if (input.moveRight) x += 1;
    if (input.moveUp) y -= 1;
    if (input.moveDown) y += 1;
    if (x === 0 && y === 0) return;
    const dir = normalize({ x, y });
    const speed = player.speed * delta * scale;
    const velocity = mul(dir, speed);
    setPos(id, add(pos, velocity));
    setX(pos.x - velocity.x);
    setY(pos.y - velocity.y);
  });
  if (!player) return null;
  return (
    <Filters adjust={isHurt ? filters.red : filters.normal}>
      <Sprite
        interactive
        image={bunnyUrl}
        width={MobSize}
        height={MobSize}
        x={ClinetWidth / 2}
        y={ClinetHeight / 2}
        pointerdown={() => {
          setIsHurt(!isHurt);
        }}
        anchor={0.5}
      />
      <DebugCollision x={ClinetWidth / 2} y={ClinetHeight / 2} />
    </Filters>
  );
}
