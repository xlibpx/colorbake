import { HexColor, RgbColor } from "./types.js";

export function toHexString(hex: HexColor): string {
  /**
   * Return a Hex String. Adds a # if not present
   * References:
   * 1. https://www.w3.org/TR/css-color-4/#hex-notation
   */
  return hex.startsWith("#") ? hex : "#" + hex;
}
export function toRgbString(rgb: RgbColor, legacy = false): string {
  /**
   * Return a CSS Color Module Level 4 RGB String
   * If legacy is set to true, return a Level 1-3 RGB String
   * References:
   * 1. https://www.w3.org/TR/css-color-4/#funcdef-rgb
   */
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
