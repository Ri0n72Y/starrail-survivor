import { useGame } from "../store";
import { Mask } from "./style";

export function Gameover() {
  const gameover = useGame((state) => state.gameover);

  return gameover ? (
    <Mask>
      Game Over
      <div style={{ fontSize: 24, fontWeight: 400 }}>Refresh to play again</div>
    </Mask>
  ) : null;
}
