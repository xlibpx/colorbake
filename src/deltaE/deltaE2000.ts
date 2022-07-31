import colorBake from "../colorBake.js";
import { ColorBakeInput, DeltaESpace } from "../types.js";
import { toDegrees, toRadians } from "../utils/general.js";

declare module "../colorBake" {}
declare module "../types" {
  interface deltaERegistry {
    deltaE2000: number;
  }
}

export const deltaE2000Space: DeltaESpace = {
  id: "deltaE2000",
  method: deltaE2000,
};

/**
 * http://www2.ece.rochester.edu/~gsharma/ciede2000/ciede2000noteCRNA.pdf
 * http://www.brucelindbloom.com/index.html?Eqn_DeltaE_CIE2000.html
 */
export function deltaE2000(
  referenceColor: ColorBakeInput,
  sampleColor: ColorBakeInput,
  { kl = 1, kc = 1, kh = 1 } = {}
): number {
  const referenceLabColor = colorBake(referenceColor).to("lab", { calc: true });
  const sampleLabColor = colorBake(sampleColor).to("lab", { calc: true });
  console.log(referenceLabColor, sampleLabColor);

  const [l1, a1, b1] = Object.values(referenceLabColor);
  const [l2, a2, b2] = Object.values(sampleLabColor);

  const lBar = (l1 + l2) / 2;

  const c1 = Math.sqrt(a1 ** 2 + b1 ** 2);
  const c2 = Math.sqrt(a2 ** 2 + b2 ** 2);
  const cBar = (c1 + c2) / 2;
  const cBar7 = cBar ** 7;

  const g = 0.5 * (1 - Math.sqrt(cBar7 / (cBar7 + 25 ** 7)));

  const a1Prime = a1 * (1 + g);
  const a2Prime = a2 * (1 + g);

  const c1Prime = Math.sqrt(a1Prime ** 2 + b1 ** 2);
  const c2Prime = Math.sqrt(a2Prime ** 2 + b2 ** 2);
  const cBarPrime = (c1Prime + c2Prime) / 2;

  let h1Prime = toDegrees(Math.atan2(b1, a1Prime));
  let h2Prime = toDegrees(Math.atan2(b2, a2Prime));

  if (h1Prime < 0) {
    h1Prime += 360;
  }
  if (h2Prime < 0) {
    h2Prime += 360;
  }

  const hBar =
    Math.abs(h1Prime - h2Prime) > 180
      ? (h1Prime + h2Prime + 360) / 2
      : (h1Prime + h2Prime) / 2;

  const t =
    1 -
    0.17 * Math.cos(toRadians(hBar - 30)) +
    0.24 * Math.cos(toRadians(2 * hBar)) +
    0.32 * Math.cos(toRadians(3 * hBar + 6)) -
    0.2 * Math.cos(toRadians(4 * hBar - 63));

  const deltaH =
    Math.abs(h2Prime - h1Prime) <= 180
      ? h2Prime - h1Prime
      : Math.abs(h2Prime - h1Prime) > 180 && h2Prime <= h1Prime
      ? h2Prime - h1Prime + 360
      : h2Prime - h1Prime - 360;

  const deltaL = l2 - l1;
  const deltaC = c2Prime - c1Prime;
  const deltaHPrime =
    2 * Math.sqrt(c1Prime * c2Prime) * Math.sin(toRadians(deltaH / 2));

  const sl = 1 + (0.015 * (lBar - 50) ** 2) / Math.sqrt(20 + (lBar - 50) ** 2);
  const sc = 1 + 0.045 * cBarPrime;
  const sh = 1 + 0.015 * cBarPrime * t;

  const deltaTheta = 30 * Math.exp(-(((hBar - 275) / 25) ** 2));

  const cBar7Prime = cBarPrime ** 7;
  const rc = 2 * Math.sqrt(cBar7Prime / (cBar7Prime + 25 ** 7));
  const rt = -1 * rc * Math.sin(toRadians(2 * deltaTheta));

  return Math.sqrt(
    (deltaL / (kl * sl)) ** 2 +
      (deltaC / (kc * sc)) ** 2 +
      (deltaHPrime / (kh * sh)) ** 2 +
      rt * (deltaC / (kc * sc)) * (deltaHPrime / (kh * sh))
  );
}
