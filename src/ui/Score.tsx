import { Text } from "@pixi/react";
import { ClinetWidth } from "../constants";
import { text } from "./typography";
import { useWeapons } from "../weapons/useWeapons";
import { useEffect } from "react";
import { useExp } from "../store/useExp";
import { useGame } from "../store";

export function Score() {
  const exp = useExp(
    (state) => state.playerExp[useGame.getState().clientPlayerId]
  );
  const [upgrade] = useWeapons((state) => [state.upgrade]);
  useEffect(() => {
    upgrade("thunder");
  }, [upgrade]);
  return (
    <Text
      text={`Exp: ${exp}`}
      anchor={0.5}
      x={ClinetWidth - 100}
      y={40}
      style={text}
    />
  );
}
