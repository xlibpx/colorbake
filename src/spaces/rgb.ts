import { ColorBake } from "../colorBake.js";
import { ColorSpace, RgbColor, ToOptions, XyzColor } from "../types.js";
import {
  Matrix3x1,
  Matrix3x3,
  multiply3x3matrix3x1,
} from "../utils/matrices.js";
import { linearizeRgbChannel, unlinearizeRgbChannel } from "../utils/rgb.js";
import {
  getDefinedRgbToXyzMatrix,
  getDefinedXyzToRgbMatrix,
  getRgbToXyzMatrix,
  getXyzToRgbMatrix,
} from "../utils/xyz.js";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare module "../colorBake" {
  interface ColorBake {
    toRgb(options?: ToOptions): RgbColor;
    toRgbString(options?: ToOptions): string;
  }
  interface ToColor {
    rgb: "toRgb";
  }
  interface ToColorString {
    rgb: "toRgbString";
  }
}
declare module "../types" {
  interface ColorRegistry {
    rgb: RgbColor;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Module                                   */
/* -------------------------------------------------------------------------- */

export const rgbSpace: ColorSpace<"rgb"> = {
  id: "rgb",
  aliases: ["rgba"],
  initial: { r: 0, g: 0, b: 0, a: 1 }, // Color Black
  range: { r: [0, 255], g: [0, 255], b: [0, 255], a: [0, 100] },
  /* ------------------------- Color Space Information ------------------------ */
  //illuminant: "d65",
  //degrees: 2,
  whitePoint: ColorBake.prototype.whitePoints["2"].d65,

  coverage: 35.9,
  /* ----------------------------- RGB Information ---------------------------- */
  rgb: {
    primaries: { xr: 0.64, yr: 0.33, xg: 0.3, yg: 0.6, xb: 0.15, yb: 0.06 },
    fromXyzMatrix: [
      [3.240_454_2, -1.537_138_5, -0.498_531_4],
      [-0.969_266, 1.876_010_8, 0.041_556],
      [0.055_643_4, -0.204_025_9, 1.057_225_2],
    ],
    toXyzMatrix: [
      [0.412_456_4, 0.357_576_1, 0.180_437_5],
      [0.212_672_9, 0.715_152_2, 0.072_175],
      [0.019_333_9, 0.119_192, 0.950_304_1],
    ],
  },
  /* ------------------------------- Conversions ------------------------------ */
  precision: 0,
  from: {
    xyz: xyzToRgb,
  },
  to: {
    xyz: rgbToXyz,
  },
  toString: toRgbString,
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert CIE XYZ to sRGB
 * References:
 * 1. http://www.brucelindbloom.com/index.html?Eqn_XYZ_to_RGB.html
 */
export function xyzToRgb(
  xyz: XyzColor,
  { calc = false, standard = true } = {}
): RgbColor {
  let xyzToRgbMatrix: Matrix3x3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  if (calc && rgbSpace.rgb?.primaries) {
    xyzToRgbMatrix = getXyzToRgbMatrix(
      rgbSpace.rgb.primaries,
      rgbSpace.whitePoint
    );
  } else {
    xyzToRgbMatrix = rgbSpace.rgb
      ? rgbSpace.rgb.fromXyzMatrix
      : getDefinedXyzToRgbMatrix("rgb");
  }
  const xyzMatrix: Matrix3x1 = [[xyz.x / 100], [xyz.y / 100], [xyz.z / 100]];
  const rgbMatrix = multiply3x3matrix3x1(xyzToRgbMatrix, xyzMatrix);

  const rgb = {
    r: unlinearizeRgbChannel(rgbMatrix[0][0]),
    g: unlinearizeRgbChannel(rgbMatrix[1][0]),
    b: unlinearizeRgbChannel(rgbMatrix[2][0]),
  };
  if (standard) {
    rgb.r *= 255;
    rgb.g *= 255;
    rgb.b *= 255;
  }
  //rgb.r = +rgb.r.toFixed(precision);
  //rgb.g = +rgb.g.toFixed(precision);
  //rgb.b = +rgb.b.toFixed(precision);
  return rgb;
}

/**
 * Convert sRGB to CIE XYZ
 * References:
 * 1. http://www.brucelindbloom.com/index.html?Eqn_RGB_to_XYZ.html
 */
export function rgbToXyz(rgb: RgbColor, { calc = false } = {}): XyzColor {
  let rgbToXyzMatrix: Matrix3x3 = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  if (calc && rgbSpace.rgb?.primaries) {
    rgbToXyzMatrix = getRgbToXyzMatrix(
      rgbSpace.rgb.primaries,
      rgbSpace.whitePoint
    );
  } else {
    rgbToXyzMatrix = rgbSpace.rgb
      ? rgbSpace.rgb.toXyzMatrix
      : getDefinedRgbToXyzMatrix("rgb");
  }
  const rgbMatrix: Matrix3x1 = [
    [linearizeRgbChannel(rgb.r / 255)],
    [linearizeRgbChannel(rgb.g / 255)],
    [linearizeRgbChannel(rgb.b / 255)],
  ];
  const xyzMatrix = multiply3x3matrix3x1(rgbToXyzMatrix, rgbMatrix);
  return {
    x: 100 * xyzMatrix[0][0],
    y: 100 * xyzMatrix[1][0],
    z: 100 * xyzMatrix[2][0],
  };
}

/**
 * Return a CSS Color Module Level 4 RGB String
 * If legacy is set to true, return a Level 1-3 RGB String
 * References:
 * 1. https://www.w3.org/TR/css-color-4/#funcdef-rgb
 */
export function toRgbString(rgb: RgbColor, { legacy = false } = {}): string {
  return !legacy
    ? "rgb(" +
        rgb.r +
        " " +
        rgb.g +
        " " +
        rgb.b +
        (rgb.a !== undefined ? "/" + rgb.a : "") +
        ")"
    : "rgb" +
        (rgb.a !== undefined ? "a" : "") +
        "(" +
        rgb.r +
        ", " +
        rgb.g +
        ", " +
        rgb.b +
        (rgb.a !== undefined ? ", " + rgb.a : "") +
        ")";
}
