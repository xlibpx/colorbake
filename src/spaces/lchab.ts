import { ColorBake } from "../colorBake.js";
import { ColorSpace, LabColor, LchabColor, ToOptions } from "../types.js";
import { toDegrees } from "../utils/general.js";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

declare module "../colorBake" {
  interface ColorBake {
    toLchab(options?: ToOptions): LchabColor;
    toLchabString(options?: ToOptions): string;
  }
  interface ToColor {
    lchab: "toLchab";
  }
  interface ToColorString {
    lchab: "toLchabString";
  }
}
declare module "../types" {
  interface ColorRegistry {
    lchab: LchabColor;
  }
}

/* -------------------------------------------------------------------------- */
/*                                   Module                                   */
/* -------------------------------------------------------------------------- */

export const lchabSpace: ColorSpace<"lchab"> = {
  id: "lchab",
  initial: { l: 0, c: 0, h: 0 },
  range: { l: [0, 100], c: [0, 100], h: [0, 100], a: [0, 100] },
  /* ------------------------- Color Space Information ------------------------ */
  whitePoint: ColorBake.prototype.whitePoints["2"].d65,
  //degrees: 2,
  coverage: 100,
  /* ------------------------------- Conversions ------------------------------ */
  precision: 4,
  from: {
    lab: labToLchab,
  },
  to: {
    lab: lchabToLab,
  },
  toString: toLchabString,
};

/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */

/**
 * Convert sRGB to Hexadecimal
 */
function labToLchab(lab: LabColor): LchabColor {
  return {
    l: lab.l,
    c: Math.sqrt(lab.a ** 2 + lab.b ** 2),
    h:
      toDegrees(Math.atan2(lab.b, lab.a)) >= 0
        ? toDegrees(Math.atan2(lab.b, lab.a))
        : toDegrees(Math.atan2(lab.b, lab.a)) + 360,
  };
}

/**
 * Convert Hexadecimal to sRGB
 */
function lchabToLab(lchab: LchabColor): LabColor {
  return { l: 0, a: 0, b: lchab.l };
}

function toLchabString(lchab: LchabColor): string {
  return String(lchab);
}
