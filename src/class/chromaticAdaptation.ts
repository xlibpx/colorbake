import { ColorBake } from "../colorBake.js";
import { ColorRegistry, WhitePoint, XyzColor } from "../types.js";
import { shallowCompare } from "../utils/general.js";
import {
  invert3x3Matrix,
  Matrix3x1,
  Matrix3x3,
  multiply3x3matrix3x1,
  multiply3x3matrix3x3,
} from "../utils/matrices.js";
import { whitePointToTristimulus } from "../utils/xyz.js";

/**
 * Applies a chromatic adaptation algorithm to convert
 * from one illuminant to another.
 * http://www.brucelindbloom.com/index.html?Eqn_ChromAdapt.html
 */
export function handleDifferentIlluminants<To extends keyof ColorRegistry>(
  color: ColorRegistry[To],
  previous: keyof ColorRegistry,
  current: To,
  next: keyof ColorRegistry | undefined
): ColorRegistry[To] {
  if (current !== "xyz") return color;
  // xyz as the mediator between two different white points
  if (!next) return color;
  const previousSpace = ColorBake.prototype.spaces[previous];
  const nextSpace = ColorBake.prototype.spaces[next];
  if (!previousSpace || !nextSpace) return color;
  if (!shallowCompare(previousSpace.whitePoint, nextSpace.whitePoint)) {
    color = chromaticAdaptation(
      color as XyzColor,
      previousSpace.whitePoint,
      nextSpace.whitePoint
    ) as ColorRegistry[To];
    return color;
  }
  return color;
}

export function chromaticAdaptation(
  xyz: XyzColor,
  sourceWhitePoint: WhitePoint,
  destinationWhitePoint: WhitePoint
): XyzColor {
  const sourceWhitePointXyz = whitePointToTristimulus(sourceWhitePoint);
  const destinationWhitePointXyz = whitePointToTristimulus(
    destinationWhitePoint
  );
  const sourceWhitePointXyzMatrix: Matrix3x1 = [
    [sourceWhitePointXyz.X],
    [sourceWhitePointXyz.Y],
    [sourceWhitePointXyz.Z],
  ];
  const destinationWhitePointXyzMatrix: Matrix3x1 = [
    [destinationWhitePointXyz.X],
    [destinationWhitePointXyz.Y],
    [destinationWhitePointXyz.Z],
  ];
  const bradfordMatrix: Matrix3x3 = [
    [0.8951, 0.2664, -0.1614],
    [-0.7502, 1.7135, 0.0367],
    [0.0389, -0.0685, 1.0296],
  ];
  const sourcePyb: Matrix3x1 = multiply3x3matrix3x1(
    bradfordMatrix,
    sourceWhitePointXyzMatrix
  );
  const destinationPyb: Matrix3x1 = multiply3x3matrix3x1(
    bradfordMatrix,
    destinationWhitePointXyzMatrix
  );
  const test: Matrix3x3 = [
    [destinationPyb[0][0] / sourcePyb[0][0], 0, 0],
    [0, destinationPyb[1][0] / sourcePyb[1][0], 0],
    [0, 0, destinationPyb[2][0] / sourcePyb[2][0]],
  ];
  const matrix = multiply3x3matrix3x3(
    multiply3x3matrix3x3(invert3x3Matrix(bradfordMatrix), test),
    bradfordMatrix
  );
  const xyzMatrix = multiply3x3matrix3x1(matrix, [[xyz.x], [xyz.y], [xyz.z]]);
  return { x: xyzMatrix[0][0], y: xyzMatrix[1][0], z: xyzMatrix[2][0] };
}
