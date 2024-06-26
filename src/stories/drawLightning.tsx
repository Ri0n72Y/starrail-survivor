import { Graphics, withFilters, Container, useTick } from "@pixi/react";
import { add, distance, mul, normalize, orthogonal, sub, vec2 } from "../math";
import { useCallback, useState } from "react";
import type { Graphics as PixiGraphics } from "@pixi/graphics";
import { GlowFilter } from "@pixi/filter-glow";

const Filters = withFilters(Container, {
  GlowFilter,
});

interface Props {
  start: vec2;
  end: vec2;
}
export function DrawLightning({ start, end }: Props) {
  const [count, setCount] = useState(0);
  const draw = useCallback((graphics: PixiGraphics) => {
    const points = getLightningPoints(start, end, 60, 20);
    graphics.clear();
    graphics.lineStyle(4, 0xde6efd, 1);
    graphics.moveTo(start.x, start.y);
    points.forEach((point) => {
      graphics.lineTo(point.x, point.y);
    });
    graphics.lineTo(end.x, end.y);
    const points2 = getLightningPoints(end, start, 60, 20);
    graphics.lineStyle(4, 0x872ffd, 1);
    points2.forEach((point) => {
      graphics.lineTo(point.x, point.y);
    });
    graphics.lineTo(start.x, start.y);
    const points3 = getLightningPoints(start, end, 60, 20);
    graphics.lineStyle(4, 0x5e18b9, 1);
    points3.forEach((point) => {
      graphics.lineTo(point.x, point.y);
    });
    graphics.lineTo(end.x, end.y);
  }, []);
  useTick(() => {
    setCount((c) => c + 1);
  });
  return (
    <Filters GlowFilter={{ color: 0xf0ff8d }}>
      {count % 2 === 0 && <Graphics draw={draw} />}
    </Filters>
  );
}

/**
 * from point start to end, draw some random points inbetween
 * @returns {vec2[]} points inbetween start and end with a random spread
 */
function getLightningPoints(
  start: vec2,
  end: vec2,
  segmentLength: number,
  spread: number
) {
  const d = distance(start, end);
  const segments = Math.floor(d / segmentLength);
  const points: vec2[] = [start];
  for (let index = 0; index < segments; index++) {
    const endPoint = getSegmentEnd(start, end, segmentLength, index);
    const offset = Math.random() * 2 * spread - spread;
    const orth = orthogonal(normalize(sub(endPoint, start)));
    points.push(add(endPoint, mul(orth, offset)));
  }
  points.push(end);
  return points;
}

function getSegmentEnd(
  start: vec2,
  end: vec2,
  segmentLength: number,
  index: number
) {
  const segLength = segmentLength * index;
  const ratio = segLength / distance(start, end);
  return {
    x: start.x + (end.x - start.x) * ratio,
    y: start.y + (end.y - start.y) * ratio,
  };
}
