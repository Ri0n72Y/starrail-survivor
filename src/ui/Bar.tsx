import { useCallback } from "react";
import type { Graphics as PixiGraphics } from "@pixi/graphics";
import { Graphics } from "@pixi/react";

interface Props {
  max: number;
  current: number;
  color: number;
  x: number;
  y: number;
}

export function Bar(props: Props) {
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.beginFill(0xd1d1d1);
      g.drawRoundedRect(-40, 0, 80, 12, 6);
      g.beginFill(props.color);
      g.lineStyle();
      g.drawRoundedRect(-40, 0, (props.current / props.max) * 80, 12, 6);
      g.endFill();
      g.lineStyle(1, 0x000000, 1);
      g.drawRoundedRect(-40, 0, 80, 12, 6);
    },
    [props]
  );

  return <Graphics x={props.x} y={props.y} draw={draw} />;
}
