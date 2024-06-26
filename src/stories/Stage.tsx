import { ReactNode } from "react";
import "./button.css";
import { Stage } from "@pixi/react";
import { ClinetHeight, ClinetWidth } from "../constants";

/**
 * Primary UI component for user interaction
 */
export const Canvas = ({ children }: { children: ReactNode }) => {
  return (
    <Stage
      width={ClinetWidth}
      height={ClinetHeight}
      options={{ autoStart: false, background: "black" }}
    >
      {children}
    </Stage>
  );
};
