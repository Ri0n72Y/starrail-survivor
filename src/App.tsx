import "./App.css";

import { Stage, Container, Sprite, Text } from "@pixi/react";
import { KeyboardInput, useKeyState } from "./keyboard";
import { useEffect } from "react";
import { usePlayers } from "./store";
import { Player } from "./Player";
import { ClinetHeight, ClinetWidth } from "./constants";
import { Mobs } from "./Mobs";

const App = () => {
  const [players, addPlayer, removePlayer] = usePlayers((state) => [
    state.players,
    state.addPlayer,
    state.removePlayer,
  ]);
  useEffect(() => {
    const star = {
      id: "star",
      name: "Star",
      hp: 50,
      speed: 10,
      score: 0,
      maxHp: 50,
      pos: { x: 0, y: 0 },
    };
    addPlayer(star);
    return () => removePlayer("star");
  }, [addPlayer, removePlayer]);
  const bunnyUrl = "https://pixijs.io/pixi-react/img/bunny.png";
  const keys = useKeyState((state) =>
    Object.keys(state.keyState).reduce((acc, key) => {
      if (state.keyState[key]) {
        acc.push(key);
      }
      return acc;
    }, [] as string[])
  );
  return (
    <>
      <Stage
        width={ClinetWidth}
        height={ClinetHeight}
        options={{ background: 0x1099bb, autoStart: true }}
      >
        <Sprite image={bunnyUrl} x={300} y={150} />
        <Sprite image={bunnyUrl} x={500} y={150} />
        <Mobs />

        {Object.keys(players).map((id) => (
          <Player key={id} id={id} />
        ))}

        <Container x={200} y={200}>
          <Text text={keys.join(", ")} anchor={0.5} x={220} y={150} />
        </Container>
      </Stage>
      <KeyboardInput />
    </>
  );
};

export default App;
