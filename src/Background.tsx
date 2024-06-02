import { Container, withFilters, Sprite } from "@pixi/react";
import { useCamera } from "./store";

const Filters = withFilters(Container, {});

const size = 1000 as const;

export function Background() {
  const pos = useCamera((state) => ({ x: state.x, y: state.y }));
  const relX = -pos.x % size;
  const relY = -pos.y % size;

  return (
    <Filters x={relX} y={relY}>
      <Sprite image="/assets/mapbase.webp" width={size} height={size} />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={0}
        y={-size}
      />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={-size}
        y={0}
      />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={-size}
        y={-size}
      />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={size}
        y={size}
      />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={0}
        y={size}
      />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={size}
        y={0}
      />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={size}
        y={-size}
      />
      <Sprite
        image="/assets/mapbase.webp"
        width={size}
        height={size}
        x={-size}
        y={+size}
      />
    </Filters>
  );
}
