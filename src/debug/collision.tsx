import type { Graphics as PixiGraphics } from "@pixi/graphics";
import { Graphics } from "@pixi/react";
import { useCallback } from "react";
import { MobSizeHalf } from "../constants";

export function DebugCollision({
  color,
  ...props
}: {
  x: number;
  y: number;
  color?: number;
}) {
  const draw = useCallback(
    (g: PixiGraphics) => {
      g.clear();
      g.lineStyle(1, color ?? 0x0000ff, 1);
      g.drawCircle(0, 0, MobSizeHalf);
    },
    [color]
  );
  return <Graphics draw={draw} {...props} />;
}
