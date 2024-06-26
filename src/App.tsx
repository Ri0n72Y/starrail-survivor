import "./App.css";

import { Stage } from "@pixi/react";
import { Fragment, useEffect, useState } from "react";
import { Background } from "./Background";
import { Mobs } from "./Mobs";
import { Player } from "./Player";
import { preload } from "./assets/preload";
import { ClinetHeight, ClinetWidth } from "./constants";
import { ExpSystem } from "./items/exp";
import { KeyboardInput } from "./keyboard";
import { usePlayers } from "./store";
import { Overlay, UI } from "./ui";
import { Weapons } from "./weapons/Weapons";

const App = () => {
  const [addPlayer, removePlayer] = usePlayers((state) => [
    state.addPlayer,
    state.removePlayer,
  ]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    preload().then(() => setLoaded(true));
    return () => setLoaded(false);
  }, []);
  useEffect(() => {
    if (loaded) {
      addPlayer({ charactorId: "star" });
      return () => removePlayer("star");
    }
  }, [addPlayer, loaded, removePlayer]);

  return (
    <>
      {!loaded && <div>Loading...</div>}
      {loaded && <Canvas />}
    </>
  );
};

function Canvas() {
  const players = usePlayers((state) => state.players);
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

        <ExpSystem />
        <UI />
      </Stage>
      <Overlay />
      <KeyboardInput />
    </>
  );
}

export default App;
