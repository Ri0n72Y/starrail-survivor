export const colors = {
  backgroundDark: 0x18153f,
  background: 0x1e1e42,
  border: 0x342794,
  label: 0x868693,
  passive: {
    border: 0x3831b3,
    icon: 0x3cbcee,
    plain: 0x3690ea,
    light: 0x49c0f7,
    shadow: 0x2f76d6,
  },
  active: {
    border: 0xf3b15e,
    icon: 0xf6a94b,
    plain: 0xfaaa56,
    light: 0xf5d657,
    shadow: 0xec924b,
  },
  color: 0xfbfafb,
  text: 0x38374a,
};

export function h2r(hex: number) {
  return `rgb(${hex >> 16}, ${(hex >> 8) & 0xff}, ${hex & 0xff})`;
}

export function h2g(hex: number, alpha = 1) {
  return `rgb(${(hex >> 8) & 0xff}, ${hex >> 16}, ${hex & 0xff}, ${alpha})`;
}
