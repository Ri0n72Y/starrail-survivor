import { Text, useTick } from "@pixi/react";
import dayjs from "dayjs";
import { useState } from "react";
import { ClinetWidth } from "../constants";
import { text } from "./typography";
import { useDifficulty } from "../store/useDifficulty";
import useInterval from "use-interval";

export function Timer() {
  const [time, setTime] = useState(0);
  useTick((_, ticker) => {
    setTime((time) => time + ticker.deltaMS);
  });
  const setSpeed = useDifficulty((state) => state.setSpeed);
  useInterval(() => setSpeed((s) => s * 1.1), 15000);
  return (
    <Text
      text={dayjs(time).format("mm:ss")}
      anchor={0.5}
      x={ClinetWidth / 2}
      y={40}
      style={text}
    />
  );
}
