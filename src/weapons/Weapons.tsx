import { Container } from "@pixi/react";
import { useCamera, usePlayers } from "../store";
import { WeaponType, useWeapons } from "./useWeapons";
import { Extinguisher } from "./Extinguisher";
import { ClinetHeight, ClinetWidth } from "../constants";

export function Weapons({ playerId }: { playerId: string }) {
  const origin = usePlayers((state) => state.positions[playerId]);
  const camera = useCamera((state) => ({ x: state.x, y: state.y }));
  const levels = useWeapons((state) => state.levels);
  return (
    <Container
      x={camera.x - origin.x + ClinetWidth * 0.5}
      y={camera.y - origin.y + ClinetHeight * 0.5}
    >
      {Object.entries(levels)
        .map(([type, level]) => {
          const Element = WeaponElement(type as WeaponType);
          if (Element && level > 0) {
            return <Element key={type} id={playerId} />;
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
  }
}
