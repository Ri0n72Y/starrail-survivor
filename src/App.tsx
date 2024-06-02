import "./App.css";

import { Stage, Container, Text } from "@pixi/react";
import { KeyboardInput, useKeyState } from "./keyboard";
import { Fragment, useEffect, useState } from "react";
import { useGame, usePlayers } from "./store";
import { Player } from "./Player";
import { ClinetHeight, ClinetWidth } from "./constants";
import { Mobs } from "./Mobs";
import { Weapons } from "./weapons/Weapons";
import { preload } from "./assets/preload";
import { Background } from "./Background";
import { UI } from "./ui";
import styled from "styled-components";

const App = () => {
  const [addPlayer, removePlayer] = usePlayers((state) => [
    state.addPlayer,
    state.removePlayer,
  ]);
  const gameover = useGame((state) => state.gameover);
  useEffect(() => {
    const star = {
      id: "star",
      name: "Star",
      maxHp: 50,

      speed: 12,
      hp: 50,
      score: 0,
      strength: 1,
      cooldown: 1,
      speedScale: 1,
      pos: { x: 0, y: 0 },
    };
    addPlayer(star);
    return () => removePlayer("star");
  }, [addPlayer, removePlayer]);

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    preload().then(() => setLoaded(true));
  }, []);
  return (
    <>
      {!loaded && <div>Loading...</div>}
      {loaded && <Canvas />}
      {gameover && (
        <GameOver>
          Game Over
          <div style={{ fontSize: 24, fontWeight: 400 }}>
            Refresh to play again
          </div>
        </GameOver>
      )}
    </>
  );
};

function Canvas() {
  const players = usePlayers((state) => state.players);
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
        options={{ autoStart: true, background: "aliceblue" }}
      >
        <Background />
        <Mobs />

        {Object.keys(players).map((id) => (
          <Fragment key={id}>
            <Weapons playerId={id} />
            <Player id={id} />
          </Fragment>
        ))}

        <Container x={200} y={200}>
          <Text text={keys.join(", ")} anchor={0.5} x={220} y={150} />
        </Container>

        <UI />
      </Stage>
      <KeyboardInput />
    </>
  );
}

const GameOver = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 50px;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 10;
  font-size: 50px;
  font-weight: 600;
  color: white;
`;

export default App;
