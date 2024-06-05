import { create } from "zustand";

export const useDebugValue = create<{ [key: string]: string }>()(() => ({}));

export function setDebugValue(
  key: string,
  value: number | string | React.MutableRefObject<number | string>
) {
  if (typeof value === "string" || typeof value === "number") {
    useDebugValue.setState((state) => ({ ...state, [key]: `${value}` }));
  }
  if (typeof value === "object") {
    useDebugValue.setState((state) => ({
      ...state,
      [key]: `${value.current ?? ""}`,
    }));
  }
}

export function removeDebugValue(key: string) {
  useDebugValue.setState((state) => {
    delete state[key];
    return state;
  });
}
