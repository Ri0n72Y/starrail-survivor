import { Container, useTick } from "@pixi/react";
import { ClinetHeight, ClinetWidth } from "../constants";
import { useCamera, usePlayers } from "../store";
import { Extinguisher } from "./Extinguisher";
import { Thunder } from "./Thunder";
import { WeaponType, useWeapons } from "./useWeapons";

export function Weapons({ playerId }: { playerId: string }) {
  const origin = usePlayers((state) => state.positions[playerId]);
  const camera = useCamera((state) => ({ x: state.x, y: state.y }));
  const [levels, update] = useWeapons((state) => [
    state.levels,
    state.updateCooldown,
  ]);
  useTick((_, ticker) => {
    // update all cooldowns
    update(ticker.deltaMS);
  });
  return (
    <Container
      x={camera.x - origin.x + ClinetWidth * 0.5}
      y={camera.y - origin.y + ClinetHeight * 0.5}
    >
      {Object.entries(levels)
        .map(([type, level]) => {
          const Element = WeaponElement(type as WeaponType);
          if (Element && level > 0) {
            return <Element key={type} playerId={playerId} />;
          }
        })
        .filter(Boolean)}
    </Container>
  );
}

function WeaponElement(id: WeaponType) {
  switch (id) {
    case "extinguisher":
      return Extinguisher;
    case "arrow":
      return null;
    case "thunder":
      return Thunder;
  }
}
