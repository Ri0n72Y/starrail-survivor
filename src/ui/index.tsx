import { useApp } from "@pixi/react";
import { useEffect } from "react";
import styled from "styled-components";
import { ClinetHeight, ClinetWidth } from "../constants";
import { useGame } from "../store";
import { Level } from "./Level";
import { Score } from "./Score";
import { Timer } from "./Timer";
import { Gameover } from "./gameover";
import { LevelUp } from "./levelup/LevelUp";

export function UI() {
  const app = useApp();
  useEffect(() => {
    useGame.getState().setApp(app);
    // useGame.getState().setIsGamePaused(true);
    return () => {
      useGame.getState().setApp(null);
      // useGame.getState().setIsGamePaused(false);
    };
  }, [app]);
  return (
    <>
      <Timer />
      <Score />
      <Level />
    </>
  );
}

export function Overlay() {
  const [paused] = useGame((state) => [
    state.isGamePaused,
    state.isLevelUp,
    state.gameover,
  ]);
  if (!paused) return null;
  return (
    <Container>
      <LevelUp />
      <Gameover />
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${ClinetWidth}px;
  height: ${ClinetHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
