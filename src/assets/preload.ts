import { Assets } from "pixi.js";

export async function preload() {
  const images = await fetch("/assets/pngs.json");
  const json = (await images.json()) as string[];
  const aliases = [];
  for (const v of json) {
    const alias = v.split(".")[0];
    Assets.add({ alias, src: `/assets/${v}` });
    aliases.push(alias);
  }
  Assets.backgroundLoad(aliases);
  aliases.forEach((v) => Assets.load(v));
}
