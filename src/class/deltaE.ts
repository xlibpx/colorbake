import { ColorBake } from "../colorBake.js";
import { DeltaESpace } from "../types.js";

export function defineDeltaE(deltaE: DeltaESpace) {
  ColorBake.prototype.deltaEMethods[deltaE.id] = deltaE.method;
}
