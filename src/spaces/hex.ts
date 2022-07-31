import { ColorBake } from "../colorBake.js";
import { ColorSpace, HexColor, RgbColor, ToOptions } from "../types.js";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare module "../colorBake" {
  interface ColorBake {
    toHex(options?: ToOptions): HexColor;
    toHexString(options?: ToOptions): string;
  }
  interface ToColor {
    hex: "toHex";
  }
  interface ToColorString {
    hex: "toHexString";
  }
}
declare module "../types" {
  interface ColorRegistry {
    hex: HexColor;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Module                                   */
/* -------------------------------------------------------------------------- */

export const hexSpace: ColorSpace<"hex"> = {
  id: "hex",
  initial: "#000",
  range: "",
  /* ------------------------- Color Space Information ------------------------ */
  whitePoint: ColorBake.prototype.whitePoints["2"].d65,
  //degrees: 2,
  coverage: 35.9,
  /* ------------------------------- Conversions ------------------------------ */
  precision: 0,
  from: {
    rgb: rgbToHex,
  },
  to: {
    rgb: hexToRgb,
  },
  toString: toHexString,
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert sRGB to Hexadecimal
 */
function rgbToHex(rgb: RgbColor): HexColor {
  //todo add support for opacity
  const rgbString = (rgb.r << 16) | (rgb.g << 8) | Math.trunc(rgb.b);
  return "#" + (0x1_00_00_00 + rgbString).toString(16).slice(1);
}

/**
 * Convert Hexadecimal to sRGB
 */
function hexToRgb(hex: HexColor): RgbColor {
  hex = hex.replace("#", "");
  if (hex.length == 6) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: 1,
    };
  } else if (hex.length == 8) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
      a: Number.parseInt(hex.slice(6, 8), 16),
    };
  } else if (hex.length == 3) {
    return {
      r: Number.parseInt(hex.charAt(0) + hex.charAt(0), 16),
      g: Number.parseInt(hex.charAt(1) + hex.charAt(1), 16),
      b: Number.parseInt(hex.charAt(2) + hex.charAt(2), 16),
      a: 1,
    };
  } else if (hex.length == 4) {
    return {
      r: Number.parseInt(hex.charAt(0) + hex.charAt(0), 16),
      g: Number.parseInt(hex.charAt(1) + hex.charAt(1), 16),
      b: Number.parseInt(hex.charAt(2) + hex.charAt(2), 16),
      a: Number.parseInt(hex.charAt(3) + hex.charAt(3), 16),
    };
  } else {
    return { r: 0, g: 0, b: 0, a: 0 };
  }
}

function toHexString(hex: HexColor): string {
  return hex;
}
