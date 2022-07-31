import { ColorBake } from "../colorBake.js";
import { ColorSpace, LabColor, ToOptions, XyzColor } from "../types.js";
import { whitePointToTristimulus } from "../utils/xyz.js";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare module "../colorBake" {
  interface ColorBake {
    toLab(options?: ToOptions): LabColor;
    toLabString(options?: ToOptions): string;
  }
  interface ToColor {
    lab: "toLab";
  }
  interface ToColorString {
    lab: "toLabString";
  }
}
declare module "../types" {
  interface ColorRegistry {
    lab: LabColor;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Module                                   */
/* -------------------------------------------------------------------------- */

export const labSpace: ColorSpace<"lab"> = {
  id: "lab",
  initial: { l: 0, a: 0, b: 0 },
  range: { l: [0, 100], a: [0, 100], b: [0, 100], alpha: [0, 100] },
  /* ------------------------- Color Space Information ------------------------ */
  whitePoint: ColorBake.prototype.whitePoints["2"].d65,
  //illuminant: "d50",
  //degrees: 2,
  coverage: 100,
  /* ------------------------------- Conversions ------------------------------ */
  precision: 4,
  from: {
    xyz: xyzToLab,
  },
  to: {
    xyz: labToXyz,
  },
  toString: toLabString,
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert CIE XYZ to CIE LAB
 * http://www.brucelindbloom.com/index.html?Eqn_XYZ_to_Lab.html
 */
function xyzToLab(xyz: XyzColor): LabColor {
  const whitePointXyz = whitePointToTristimulus(labSpace.whitePoint);
  const xr = xyz.x / 100 / whitePointXyz.X;
  const yr = xyz.y / 100 / whitePointXyz.Y;
  const zr = xyz.z / 100 / whitePointXyz.Z;

  const fx =
    xr > 216 / 24_389 ? Math.cbrt(xr) : ((24_389 / 27) * xr + 16) / 116;
  const fy =
    yr > 216 / 24_389 ? Math.cbrt(yr) : ((24_389 / 27) * yr + 16) / 116;
  const fz =
    zr > 216 / 24_389 ? Math.cbrt(zr) : ((24_389 / 27) * zr + 16) / 116;
  return { l: 116 * fy - 16, a: 500 * (fx - fy), b: 200 * (fy - fz) };
}

/**
 * Convert Hexadecimal to sRGB
 */
function labToXyz(lab: LabColor): XyzColor {
  return { x: 0, y: 0, z: lab.l };
}

function toLabString(lab: LabColor): string {
  return String(lab);
}
