type vec2 = { x: number; y: number };

export function normalize(vec: vec2): vec2 {
  const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
  return { x: vec.x / length, y: vec.y / length };
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
