import { ColorBake } from "../colorBake.js";
import { ColorSpace, RgbColor, ToOptions } from "../types.js";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare module "../colorBake" {
  interface ColorBake {
    toRgbw(options?: ToOptions): RgbwColor;
    toRgbwString(options?: ToOptions): string;
  }
  interface ToColor {
    rgbw: "toRgbw";
  }
  interface ToColorString {
    rgbw: "toRgbwString";
  }
}
declare module "../types" {
  interface ColorRegistry {
    rgbw: RgbwColor;
  }
}
export type RgbwColor = {
  r: number;
  g: number;
  b: number;
  w: number;
  a?: number | undefined;
};

/* -------------------------------------------------------------------------- */
/*                                   Module                                   */
/* -------------------------------------------------------------------------- */

export const rgbwSpace: ColorSpace<"rgbw"> = {
  id: "rgbw",
  initial: { r: 0, g: 0, b: 0, w: 0, a: 1 },
  range: { r: [0, 100], g: [0, 100], b: [0, 100], w: [0, 100], a: [0, 100] },
  /* ------------------------- Color Space Information ------------------------ */
  whitePoint: ColorBake.prototype.whitePoints["2"].d65,
  //degrees: 2,
  coverage: 35.9,
  /* ------------------------------- Conversions ------------------------------ */
  precision: 0,
  from: {
    rgb: rgbToRgbw,
  },
  to: {
    rgb: rgbwToRgb,
  },
  toString: toHexString,
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert sRGB to Hexadecimal
 * https://stackoverflow.com/a/59538146
 */
function rgbToRgbw(rgb: RgbColor): RgbwColor {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  const min = Math.min(rgb.r, rgb.g, rgb.b);
  const w = min / max < 0.5 ? (min * max) / (max - min) : max;
  const k = (w + max) / max;
  return {
    r: k * rgb.r - w,
    g: k * rgb.g - w,
    b: k * rgb.b - w,
    w: w,
  };
}

/**
 * Convert Hexadecimal to sRGB
 */
function rgbwToRgb(rgbw: RgbwColor): RgbColor {
  return { r: rgbw.r, g: rgbw.g, b: rgbw.b };
}

function toHexString(rgbw: RgbwColor): string {
  return rgbw.toString();
}
