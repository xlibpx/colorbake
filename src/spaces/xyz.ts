import { ColorBake } from "../colorBake.js";
import { ColorSpace, ToOptions, XyzColor } from "../types.js";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare module "../colorBake" {
  interface ColorBake {
    toXyz(options?: ToOptions): XyzColor;
    toXyzString(options?: ToOptions): string;
  }
  interface ToColor {
    xyz: "toXyz";
  }
  interface ToColorString {
    xyz: "toXyzString";
  }
}
declare module "../types" {
  interface ColorRegistry {
    xyz: XyzColor;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Module                                   */
/* -------------------------------------------------------------------------- */

export const xyzSpace: ColorSpace<"xyz"> = {
  id: "xyz",
  initial: { x: 0, y: 0, z: 0 },
  range: { x: [0, 100], y: [0, 100], z: [0, 100], a: [0, 100] },
  /* ------------------------- Color Space Information ------------------------ */
  whitePoint: ColorBake.prototype.whitePoints["2"]["d65"],
  //degrees: 2,
  coverage: 100,
  /* ------------------------------- Conversions ------------------------------ */
  precision: 4,
  from: {},
  to: {},
  toString: toXyzString,
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert sRGB to Hexadecimal
 */

/**
 * Convert Hexadecimal to sRGB
 */

function toXyzString(xyz: XyzColor): string {
  return String(xyz);
}
