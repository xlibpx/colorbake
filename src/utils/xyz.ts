import { RgbPrimaries, WhitePoint, WhitePointXYZ } from "../types.js";
import {
  invert3x3Matrix,
  Matrix3x1,
  Matrix3x3,
  multiply3x3matrix3x1,
} from "./matrices.js";

/**
 *  https://en.wikipedia.org/wiki/CIE_1931_color_space#CIE_standard_observer
 */
export function whitePointToTristimulus(whitePoint: WhitePoint): WhitePointXYZ {
  return {
    //X: (100 / whitePoint.y) * whitePoint.x,
    //Y: 100,
    //Z: (100 / whitePoint.y) * (1 - whitePoint.x - whitePoint.y),
    X: whitePoint.x / whitePoint.y,
    Y: 1,
    Z: (1 - whitePoint.x - whitePoint.y) / whitePoint.y,
  };
}

/**
 * Computes 3x3 matrix for RGB to XYZ
 * http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
 */
export function getRgbToXyzMatrix(
  primaries: RgbPrimaries,
  whitePoint: WhitePoint
): Matrix3x3 {
  const Xr = primaries.xr / primaries.yr;
  const Yr = 1;
  const Zr = (1 - primaries.xr - primaries.yr) / primaries.yr;
  const Xg = primaries.xg / primaries.yg;
  const Yg = 1;
  const Zg = (1 - primaries.xg - primaries.yg) / primaries.yg;
  const Xb = primaries.xb / primaries.yb;
  const Yb = 1;
  const Zb = (1 - primaries.xb - primaries.yb) / primaries.yb;
  const rgbMatrix: Matrix3x3 = [
    [Xr, Xg, Xb],
    [Yr, Yg, Yb],
    [Zr, Zg, Zb],
  ];
  const whitePointXyz = whitePointToTristimulus(whitePoint);
  const referenceMatrix: Matrix3x1 = [
    [whitePointXyz.X],
    [whitePointXyz.Y],
    [whitePointXyz.Z],
  ];
  const S = multiply3x3matrix3x1(invert3x3Matrix(rgbMatrix), referenceMatrix);
  const Sr = S[0][0];
  const Sg = S[1][0];
  const Sb = S[2][0];
  return [
    [Sr * Xr, Sg * Xg, Sb * Xb],
    [Sr * Yr, Sg * Yg, Sb * Yb],
    [Sr * Zr, Sg * Zg, Sb * Zb],
  ];
}
/**
 * Computes 3x3 matrix for XYZ to RGB
 */
export function getXyzToRgbMatrix(
  primaries: RgbPrimaries,
  whitePoint: WhitePoint
): Matrix3x3 {
  return invert3x3Matrix(getRgbToXyzMatrix(primaries, whitePoint));
}

export function getDefinedXyzToRgbMatrix(rgbSpace: RgbSpace): Matrix3x3 {
  switch (rgbSpace) {
    case "rgb": {
      return [
        [3.240_454_2, -1.537_138_5, -0.498_531_4],
        [-0.969_266, 1.876_010_8, 0.041_556],
        [0.055_643_4, -0.204_025_9, 1.057_225_2],
      ];
    }
    case "adobeRgb": {
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
    }
    case "displayP3": {
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
      ];
    }
    case "dciP3": {
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 3],
      ];
    }
    default:
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 4],
      ];
    // No default
  }
}

export function getDefinedRgbToXyzMatrix(rgbSpace: RgbSpace): Matrix3x3 {
  switch (rgbSpace) {
    case "rgb": {
      return [
        [0.412_456_4, 0.357_576_1, 0.180_437_5],
        [0.212_672_9, 0.715_152_2, 0.072_175],
        [0.019_333_9, 0.119_192, 0.950_304_1],
      ];
    }
    case "adobeRgb": {
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ];
    }
    case "displayP3": {
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 1],
      ];
    }
    case "dciP3": {
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 2],
      ];
    }
    default:
      return [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 3],
      ];
    // No default
  }
}

export function getRgbPrimaries(rgbSpace: RgbSpace): RgbPrimaries {
  const primaries = {
    rgb: { xr: 0.64, yr: 0.33, xg: 0.3, yg: 0.6, xb: 0.15, yb: 0.06 },
    adobeRgb: { xr: 0.64, yr: 0.33, xg: 0.21, yg: 0.71, xb: 0.15, yb: 0.06 },
    displayP3: { xr: 0.68, yr: 0.32, xg: 0.265, yg: 0.69, xb: 0.15, yb: 0.06 },
    dciP3: { xr: 0.68, yr: 0.32, xg: 0.265, yg: 0.69, xb: 0.15, yb: 0.06 },
    cieRgb: {
      xr: 0.735,
      yr: 0.265,
      xg: 0.274,
      yg: 0.717,
      xb: 0.167,
      yb: 0.009,
    },
  };
  return primaries[rgbSpace];
}

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type RgbSpace = "rgb" | "adobeRgb" | "displayP3" | "dciP3" | "cieRgb";

export type ObserverIlluminant =
  | "a"
  | "b"
  | "c"
  | "d50"
  | "d55"
  | "d65"
  | "d75"
  | "e";

export type ObserverDegrees = 2 | 10;
