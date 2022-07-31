import { LabColor } from "../types.js";

export function deltaE76(referenceColor: LabColor, sampleColor: LabColor) {
  const [l1, a1, b1] = Object.values(referenceColor);
  const [l2, a2, b2] = Object.values(sampleColor);
  return Math.sqrt((l2 - l1) ** 2 + (a2 - a1) ** 2 + (b2 - b1) ** 2);
}
