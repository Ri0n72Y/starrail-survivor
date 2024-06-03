import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { Assets } from "pixi.js";
import { useEnemies, usePlayers } from "../store";
import { useWeapons } from "../weapons/useWeapons";

export async function preload() {
  dayjs.extend(duration);

  const images = await fetch("/assets/pngs.json");
  const imageJsons = (await images.json()) as string[];
  const aliases = [];
  for (const v of imageJsons) {
    const alias = v.split(".")[0];
    Assets.add({ alias, src: `/assets/${v}` });
    aliases.push(alias);
  }
  const fonts = await fetch("/assets/fonts.json");
  const fontJsons = (await fonts.json()) as string[];
  for (const v of fontJsons) {
    const alias = v.split(".")[0];
    Assets.add({ alias, src: `/assets/${v}` });
  }
  Assets.backgroundLoad(aliases);
  aliases.forEach((v) => Assets.load(v));

  await useWeapons.getState().loadWeapon();
  await useEnemies.getState().loadEnemyMeta();
  await usePlayers.getState().loadCharacters();
}
