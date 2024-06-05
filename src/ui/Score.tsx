import { Text } from "@pixi/react";
import { ClinetWidth } from "../constants";
import { useScore } from "../store";
import { text } from "./typography";
import { useWeapons } from "../weapons/useWeapons";
import { useEffect } from "react";

export function Score() {
  const score = useScore((state) => state.score);
  const [upgrade] = useWeapons((state) => [state.upgrade]);
  useEffect(() => {
    upgrade("thunder");
  }, [upgrade]);
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
