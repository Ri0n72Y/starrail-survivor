import { useEffect } from "react";
import { create } from "zustand";

interface InputConfig {
  moveUp: string[];
  moveDown: string[];
  moveLeft: string[];
  moveRight: string[];
  fire1: string[];
  fire2: string[];
  pause: string[];
}
const defaultConfig: InputConfig = {
  moveUp: ["ArrowUp", "w"],
  moveDown: ["ArrowDown", "s"],
  moveLeft: ["ArrowLeft", "a"],
  moveRight: ["ArrowRight", "d"],
  fire1: ["z", " "],
  fire2: ["x", "Shift"],
  pause: ["Escape"],
};

interface Input {
  moveUp: boolean;
  moveDown: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  fire1: boolean;
  fire2: boolean;
  pause: boolean;
}

export const useInput = (config?: InputConfig): Input => {
  if (!config) config = defaultConfig;
  const keyState = useKeyState((state) => state.keyState);

  return {
    moveUp: config.moveUp.reduce((acc, key) => acc || keyState[key], false),
    moveDown: config.moveDown.reduce((acc, key) => acc || keyState[key], false),
    moveLeft: config.moveLeft.reduce((acc, key) => acc || keyState[key], false),
    moveRight: config.moveRight.reduce(
      (acc, key) => acc || keyState[key],
      false
    ),
    fire1: config.fire1.reduce((acc, key) => acc || keyState[key], false),
    fire2: config.fire2.reduce((acc, key) => acc || keyState[key], false),
    pause: config.pause.reduce((acc, key) => acc || keyState[key], false),
  };
};

interface KeyState {
  keyState: Record<string, boolean>;
  setKeyState: (key: string, value: boolean) => void;
}
export const useKeyState = create<KeyState>()((set) => ({
  keyState: {},
  setKeyState: (key: string, value: boolean) => {
    set((state) => ({ keyState: { ...state.keyState, [key]: value } }));
  },
}));

export function KeyboardInput() {
  useKeyboard();
  return null;
}

const useKeyboard = () => {
  const [setKeyState] = useKeyState((state) => [state.setKeyState]);
  useEffect(() => {
    function keydown({ key }: KeyboardEvent) {
      setKeyState(key, true);
    }
    function keyup({ key }: KeyboardEvent) {
      setKeyState(key, false);
    }
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
    };
  }, [setKeyState]);
};
