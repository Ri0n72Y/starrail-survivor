import { TextStyle } from "@pixi/text";

export const text = new TextStyle({
  align: "center",
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fontSize: 24,
  fontWeight: "400",
  fill: ["#ffffff", "#66ccff"], // gradient
  stroke: "#000000",
  strokeThickness: 2,
  dropShadow: true,
  dropShadowColor: "#a0a0a0",
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 2,
});
