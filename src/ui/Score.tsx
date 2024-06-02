import { Text } from "@pixi/react";
import { ClinetWidth } from "../constants";
import { useScore } from "../store";
import { text } from "./typography";
import { useWeapons } from "../weapons/useWeapons";
import { useEffect } from "react";

export function Score() {
  const score = useScore((state) => state.score);
  const [level, upgrade] = useWeapons((state) => [
    state.levels["extinguisher"],
    state.upgrade,
  ]);
  useEffect(() => {
    if (Math.floor(score / 100) > level) {
      upgrade("extinguisher");
    }
  }, [level, score, upgrade]);
  return (
    <Text
      text={`Score: ${score}`}
      anchor={0.5}
      x={ClinetWidth - 100}
      y={40}
      style={text}
    />
  );
}
