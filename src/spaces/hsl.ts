import { ColorBake } from "../colorBake.js";
import {
  ColorSpace,
  HexColor,
  HslColor,
  RgbColor,
  ToOptions,
} from "../types.js";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare module "../colorBake" {
  interface ColorBake {
    toHsl(options?: ToOptions): HexColor;
    toHslString(options?: ToOptions): string;
  }
  interface ToColor {
    hsl: "toHsl";
  }
  interface ToColorString {
    hsl: "toHslString";
  }
}
declare module "../types" {
  interface ColorRegistry {
    hsl: HslColor;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Module                                   */
/* -------------------------------------------------------------------------- */

export const hslSpace: ColorSpace<"hsl"> = {
  id: "hsl",
  initial: { h: 0, s: 0, l: 0 },
  range: { h: [0, 100], s: [0, 100], l: [0, 100], a: [0, 100] },
  /* ------------------------- Color Space Information ------------------------ */
  whitePoint: ColorBake.prototype.whitePoints["2"].d65,
  // degrees: 2,
  coverage: 35.9,
  /* ------------------------------- Conversions ------------------------------ */
  precision: 0,
  from: {
    rgb: rgbToHsl,
  },
  to: {
    rgb: hslToRgb,
  },
  toString: toHslString,
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert sRGB to Hexadecimal
 */
function rgbToHsl(rgb: RgbColor): HslColor {
  return { h: 0, s: 0, l: rgb.r };
}

/**
 * Convert Hexadecimal to sRGB
 */
function hslToRgb(hsl: HslColor): RgbColor {
  return { r: 0, g: 0, b: hsl.h };
}

function toHslString(hsl: HslColor): string {
  return String(hsl);
}
