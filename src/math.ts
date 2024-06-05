export type vec2 = { x: number; y: number };

export function normalize(vec: vec2): vec2 {
  const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  return { x: vec.x / length, y: vec.y / length };
}

export function mag(vec: vec2): number {
  return Math.sqrt(vec.x * vec.x + vec.y * vec.y);
}

export function add(vec1: vec2, vec2: vec2): vec2 {
  return { x: vec1.x + vec2.x, y: vec1.y + vec2.y };
}

export function sub(vec1: vec2, vec2: vec2): vec2 {
  return { x: vec1.x - vec2.x, y: vec1.y - vec2.y };
}

export function mul(vec: vec2, scale: number): vec2 {
  return { x: vec.x * scale, y: vec.y * scale };
}

export function distance(vec1: vec2, vec2: vec2): number {
  return Math.sqrt((vec1.x - vec2.x) ** 2 + (vec1.y - vec2.y) ** 2);
}

export function closestNPoints(point: vec2, points: vec2[], n: number): vec2[] {
  return points
    .map((p) => ({ point: p, distance: distance(point, p) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n)
    .map((p) => p.point);
}

export function orthogonal(vec: vec2): vec2 {
  return { x: -vec.y, y: vec.x };
}

export function isRectIntersectingCircle(
  rect: { x: number; y: number; width: number; height: number },
  circle: { x: number; y: number; radius: number }
) {
  const dx =
    circle.x -
    Math.max(rect.x, Math.min(circle.x + circle.radius, rect.x + rect.width));
  const dy =
    circle.y -
    Math.max(rect.y, Math.min(circle.y + circle.radius, rect.y + rect.height));
  return dx * dx + dy * dy < circle.radius * circle.radius;
}

export function isRingIntersectingCircle(
  ring: { x: number; y: number; radiusIn: number; radiusOut: number },
  circle: { x: number; y: number; radius: number }
) {
  const dx = circle.x - ring.x;
  const dy = circle.y - ring.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return (
    distance < ring.radiusOut + circle.radius &&
    distance > ring.radiusIn - circle.radius
  );
}
