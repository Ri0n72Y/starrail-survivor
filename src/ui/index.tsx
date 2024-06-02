import { Level } from "./Level";
import { Score } from "./Score";
import { Timer } from "./Timer";

export function UI() {
  return (
    <>
      <Timer />
      <Score />
      <Level />
    </>
  );
}
