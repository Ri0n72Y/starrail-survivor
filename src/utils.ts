import { distance, vec2 } from "./math";

export interface EnemyPositionInfo {
  id: string;
  point: vec2;
  distance: number;
}
export function closestNEnemies(
  pos: vec2,
  enemies: Record<string, vec2>,
  n: number,
  maxDistance: number
): EnemyPositionInfo[] {
  return Object.entries(enemies)
    .map((e) => ({ id: e[0], point: e[1], distance: distance(pos, e[1]) }))
    .filter((e) => e.distance < maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n);
}
