import { Text } from "@pixi/react";
import { useWeapons } from "../weapons/useWeapons";
import { text } from "./typography";

export function Level() {
  const level = useWeapons((state) => state.levels["extinguisher"]);
  return (
    <Text text={`Level: ${level}`} anchor={0.5} x={100} y={40} style={text} />
  );
}
