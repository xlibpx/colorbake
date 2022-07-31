import { ColorBake } from "../colorBake.js";
import {
  ColorRegistry,
  KeysOfUnion,
  ToOptions,
  UnionToIntersection,
} from "../types.js";

export function roundColor<To extends keyof ColorRegistry>(
  color: ColorRegistry[keyof ColorRegistry],
  options: ToOptions,
  toSpace: To
) {
  if (typeof color === "string") return color;
  const precision = determinePrecision(options, toSpace);
  if (options.round === undefined || options.round === true)
    color = roundColorChannels(
      color as UnionToIntersection<
        Exclude<ColorRegistry[keyof ColorRegistry], string>
      >,
      precision
    );
  return color as ColorRegistry[To];
}

export function determinePrecision(
  options: ToOptions,
  toSpace: keyof ColorRegistry
) {
  if (options.precision !== undefined) return options.precision;
  const space = ColorBake.prototype.spaces[toSpace];
  if (space && space.precision !== undefined) return space.precision;
  return 2;
}

export function roundColorChannels(
  color: UnionToIntersection<
    Exclude<ColorRegistry[keyof ColorRegistry], string>
  >,
  precision: number
) {
  for (const key in color) {
    const g = key as KeysOfUnion<
      Exclude<ColorRegistry[keyof ColorRegistry], string>
    >;
    const channel = color[g];
    if (!channel) continue;
    color[g] = +channel.toFixed(precision);
  }
  return color;
}
