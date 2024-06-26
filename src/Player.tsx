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
import { useCamera, useGame, usePlayerHurt, usePlayers } from "./store";
import { DebugCollision } from "./debug/collision";
import { Bar } from "./ui/Bar";

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
  const [player, playerHp, pos, setPos, updateHp] = usePlayers((state) => [
    state.players[id],
    state.playerHp[id],
    state.positions[id],
    state.setPosition,
    state.updatePlayerHp,
  ]);
  const [info] = usePlayers((state) => [state.characters[player.charactorId]]);
  const [hurt, setHurt] = usePlayerHurt((state) => [state[id], state.setHurt]);
  const [setX, setY] = useCamera((state) => [state.setX, state.setY]);
  const [paused, setPaused, endgame] = useGame((state) => [
    state.isGamePaused,
    state.setIsGamePaused,
    state.setGameover,
  ]);
  useTick((delta, ticker) => {
    // position
    let x = 0;
    let y = 0;
    if (input.moveLeft) x -= 1;
    if (input.moveRight) x += 1;
    if (input.moveUp) y -= 1;
    if (input.moveDown) y += 1;
    if (x !== 0 || y !== 0) {
      const dir = normalize({ x, y });
      const speed = info.speed * delta * scale;
      const velocity = mul(dir, speed);
      setPos(id, add(pos, velocity));
      setX(pos.x - velocity.x);
      setY(pos.y - velocity.y);
    }

    // pause
    if (!input.pause && paused) {
      setPaused(false);
    }
    if (input.pause && !paused) {
      setPaused(true);
      ticker.stop();
      const restart = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          ticker.start();
          window.removeEventListener("keydown", restart);
        }
      };
      window.addEventListener("keydown", restart);
    }

    // hurt
    if (hurt && !isHurt) {
      setIsHurt(true);
      updateHp([id], [playerHp - (hurt as unknown as number)]);
      setTimeout(() => {
        setIsHurt(false);
        setHurt(id, 0);
      }, 300);
    }

    // gameover;
    if (playerHp <= 0) {
      ticker.stop();
      endgame(true);
    }
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
        anchor={0.5}
      />
      <Bar
        x={ClinetWidth / 2}
        y={ClinetHeight / 2 + 55}
        max={info.hp * player.maxHpScale}
        current={playerHp}
        color={0xff0000}
      />
      <DebugCollision x={ClinetWidth / 2} y={ClinetHeight / 2} />
    </Filters>
  );
}
