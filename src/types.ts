import { DeltaEMethod } from "./colorBake.js";
import { Matrix3x3 } from "./utils/matrices.js";

export type HexColor = string;

export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number | undefined;
}

export interface AdobeRgbColor {
  r: number;
  g: number;
  b: number;
  a?: number | undefined;
}

export interface DisplayP3Color {
  r: number;
  g: number;
  b: number;
  a?: number | undefined;
}

export interface DciP3Color {
  r: number;
  g: number;
  b: number;
  a?: number | undefined;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number | undefined;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
  a?: number | undefined;
}

export interface HsbColor {
  h: number;
  s: number;
  b: number;
  a?: number | undefined;
}

export interface HwbColor {
  h: number;
  w: number;
  b: number;
  a?: number | undefined;
}

export interface XyzColor {
  x: number;
  y: number;
  z: number;
  a?: number | undefined;
}

export interface XyYColor {
  x: number;
  y: number;
  Y: number;
  a?: number | undefined;
}

export interface LabColor {
  l: number;
  a: number;
  b: number;
  alpha?: number | undefined;
}

export interface LchabColor {
  l: number;
  c: number;
  h: number;
  a?: number | undefined;
}

export interface OkLabColor {
  l: number;
  a: number;
  b: number;
  alpha?: number | undefined;
}

export interface LuvColor {
  l: number;
  u: number;
  v: number;
  a?: number | undefined;
}

export interface OkLuvColor {
  l: number;
  u: number;
  v: number;
  a?: number | undefined;
}

export interface LchuvColor {
  l: number;
  c: number;
  h: number;
  a?: number | undefined;
}

export interface HunterLabColor {
  l: number;
  a: number;
  b: number;
  alpha?: number | undefined;
}

export interface CmyColor {
  c: number;
  m: number;
  y: number;
  a?: number | undefined;
}

export interface CmykColor {
  c: number;
  m: number;
  y: number;
  k: number;
  a?: number | undefined;
}

export interface ColorObject<K extends keyof ColorRegistry> {
  type: K;
  color: ColorRegistry[K] | number[];
}

/* ----------------------------- ColorBake Input ---------------------------- */
export type ColorBakeInput = ColorObjectInput | ColorArrayWithType | string;

export type ColorObjectRawInput = {
  [K in KeysNotMatching<ColorRegistry, string>]: {
    type: K;
    color: ColorRegistry[K] | number[];
  };
} & {
  [K in KeysMatching<ColorRegistry, string>]: {
    type: K;
    color: ColorRegistry[K];
  };
};

export type ColorObjectInput = ColorObjectRawInput[keyof ColorObjectRawInput];

export type ColorArrayWithType = [
  KeysNotMatching<ColorRegistry, string>,
  ...number[]
];

/* ----------------------- ColorBake Class Interfaces ----------------------- */
export type ColorType = keyof ColorRegistry;

//export interface ColorRegistry {}

export interface ColorSpace<ID extends keyof ColorRegistry> {
  id: ID;
  aliases?: string[];
  initial: ColorRegistry[ID];
  range: string extends ColorRegistry[ID]
    ? string
    : { [key in keyof ColorRegistry[ID]]: [number, number] };

  //illuminant: "d50" | "d65"; //todo proper
  //degrees: number;
  whitePoint: WhitePoint;
  coverage: number;
  precision: number;
  from: {
    [From in keyof ColorRegistry]?: (
      color: ColorRegistry[From],
      options?: ToOptions
    ) => ColorRegistry[ID];
  };
  to: {
    [To in keyof ColorRegistry]?: (
      color: ColorRegistry[ID],
      options?: ToOptions
    ) => ColorRegistry[To];
  };
  toString: (color: ColorRegistry[ID]) => string;
  rgb?: {
    primaries: RgbPrimaries;
    fromXyzMatrix: Matrix3x3;
    toXyzMatrix: Matrix3x3;
  };
}

export type WhitePoint = {
  x: number;
  y: number;
};

export type WhitePointXYZ = {
  X: number;
  Y: number;
  Z: number;
};

export type RgbPrimaries = {
  xr: number;
  yr: number;
  xg: number;
  yg: number;
  xb: number;
  yb: number;
};

export interface ToOptions {
  round?: boolean;
  precision?: number;
  calc?: boolean; // calculate matrix in rgb/xyz conversion
  legacy?: boolean;
  standard?: boolean;
}

export interface DeltaESpace {
  id: string;
  method: DeltaEMethod;
}

/* -------------------------------------------------------------------------- */
/*                                    Tools                                   */
/* -------------------------------------------------------------------------- */
export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type KeysMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];
export type KeysNotMatching<T, V> = {
  [K in keyof T]-?: T[K] extends V ? never : K;
}[keyof T];
