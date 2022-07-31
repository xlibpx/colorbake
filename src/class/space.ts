import {
  ColorBake,
  Spaces,
  StringBuilders,
  ToColor,
  ToColorString,
} from "../colorBake.js";
import {
  ColorRegistry,
  ColorSpace,
  ToOptions,
  UnionToIntersection,
} from "../types.js";
import { capitalizeFirstLetter } from "../utils/general.js";

export function defineSpaces<T extends keyof ColorRegistry>(
  colorSpaces: ColorSpace<T>[]
): void {
  for (const colorSpace of colorSpaces) {
    defineSpace(colorSpace);
  }
}

export function defineSpace<
  ID extends keyof ColorRegistry,
  From extends keyof ColorRegistry,
  To extends keyof ColorRegistry
>(colorSpace: ColorSpace<ID>): void {
  if (!ColorBake.prototype.spaces[colorSpace.id]) {
    ColorBake.prototype.spaces[colorSpace.id] = colorSpace as Spaces[ID];
  }
  /* -------------------------- Class Convert Object -------------------------- */
  for (const from of Object.keys(colorSpace.from)) {
    if (!ColorBake.prototype.converters[from as From]) {
      ColorBake.prototype.converters[from as From] = {};
    }
    const g = ColorBake.prototype.converters[from as From];
    const h = colorSpace.from[from as From] as ColorSpace<From>["to"][ID];
    if (!g || !h) continue;
    //@ts-ignore
    g[colorSpace.id] = h; //todo fix
  }
  /* --------------------------------- Convert -------------------------------- */
  if (!ColorBake.prototype.converters[colorSpace.id]) {
    ColorBake.prototype.converters[colorSpace.id] = {};
  }
  for (const to of Object.keys(colorSpace.to)) {
    const g = ColorBake.prototype.converters[colorSpace.id];
    const h = colorSpace.to[to as To];
    if (!g || !h) continue;
    //@ts-ignore
    g[to as To] = h; //todo fix
  }
  /* ---------------------------- Defining toColor ---------------------------- */
  const xx = `to${capitalizeFirstLetter(colorSpace.id)}` as ToColor[ID];
  ColorBake.prototype[xx] = function (
    this: ColorBake,
    options: ToOptions = {}
  ) {
    return this.to(colorSpace.id, options) as UnionToIntersection<
      ColorRegistry[keyof ColorRegistry]
    >;
  };
  /* ---------------------------- String Composers ---------------------------- */
  ColorBake.prototype.stringBuilders[colorSpace.id] =
    colorSpace.toString as StringBuilders[ID];
  /* ------------------------- Defining toColorString ------------------------- */
  const xxx = `to${capitalizeFirstLetter(
    colorSpace.id
  )}String` as ToColorString[ID];
  ColorBake.prototype[xxx] = function (
    this: ColorBake,
    options: ToOptions = {}
  ) {
    return this.toString(colorSpace.id, options) as UnionToIntersection<
      ColorRegistry[keyof ColorRegistry]
    >;
  };
  /* ----------------------------- Defining Names ----------------------------- */

  let names: string[] = [colorSpace.id];
  if (colorSpace.aliases) {
    names = [...names, ...colorSpace.aliases];
  }
  for (const name of names) {
    const lowercaseName = name.toLowerCase();
    const lowercaseAlphaName: string = lowercaseName.replace(
      /[^\dA-Za-z]+/g,
      ""
    );
    ColorBake.prototype.names[name] = colorSpace.id;
    ColorBake.prototype.names[lowercaseName] = colorSpace.id;
    ColorBake.prototype.names[lowercaseAlphaName] = colorSpace.id;
  }
}
