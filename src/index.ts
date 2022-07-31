export { defineSpace } from "./class/space.js";
export { default } from "./colorBake.js";
export { deltaE2000Space } from "./deltaE/deltaE2000.js";
export { displayP3Space } from "./spaces/displayP3.js";
export { hexSpace } from "./spaces/hex.js";
export { hslSpace } from "./spaces/hsl.js";
export { labSpace } from "./spaces/lab.js";
export { lchabSpace } from "./spaces/lchab.js";
export { rgbSpace } from "./spaces/rgb.js";
export { rgbwSpace } from "./spaces/rgbw.js";
export { xyzSpace } from "./spaces/xyz.js";

import { defineDeltaE } from "./class/deltaE.js";
import { defineSpace } from "./class/space.js";
import { ColorBake as ColorBakeCore } from "./colorBake.js";
import { deltaE2000Space } from "./deltaE/deltaE2000.js";
import { displayP3Space } from "./spaces/displayP3.js";
import { hexSpace } from "./spaces/hex.js";
import { hslSpace } from "./spaces/hsl.js";
import { labSpace } from "./spaces/lab.js";
import { lchabSpace } from "./spaces/lchab.js";
import { rgbSpace } from "./spaces/rgb.js";
import { rgbwSpace } from "./spaces/rgbw.js";
import { xyzSpace } from "./spaces/xyz.js";

const ColorBake = ColorBakeCore;
defineSpace(rgbSpace);
defineSpace(hslSpace);
defineSpace(hexSpace);
defineSpace(xyzSpace);
defineSpace(labSpace);
defineSpace(lchabSpace);
defineSpace(rgbwSpace);
defineSpace(displayP3Space);
defineDeltaE(deltaE2000Space);

export { ColorBake };
//colorBake("#145664").to("rgb");
/*
const x = colorBake({
  type: "rgb",
  color: { r: 100, g: 200, b: 100 },
}).to("xyz", { calc: true, round: true });

console.log(
  x,
  colorBake({ type: "xyz", color: x }).toRgb({ calc: true, round: true }),
  "++++++"
);
*/
/*
console.time("test");

console.log(
  colorBake({
    type: "hex",
    color: "#456123",
  }).to("lchab", { calc: true, round: true })
);
console.log(
  colorBake({ type: "displayP3", color: { r: 0, g: 1, b: 0 } }).toRgb({
    calc: true,
    standard: false,
    precision: 10,
  })
);
console.log(colorBake("rgb(100,54,67)").deltaE("rgb(102,54,60)"));

console.timeEnd("test");
*/
/*
console.time("test");
for (let a = 0; a < 3_000_000; a++) {
  colorBake({ type: "rgb", color: { r: 0, g: 0, b: 0 } }).to("hex");
}
console.timeEnd("test");
*/

//TODO SUPPORT LIST
/**
 * todo color correction for lossy conversions. EX xyz->rgb or displayP3->rgb
 * todo get path conversion function
 * todo is equal function EX colorBake("rgb(0,0,0)").isEqual("xyz(0,0,0)")
 * todo alpha setting function. modifies if exist, adds if does not. can also modify hex alpha
 * todo  color manipulation: lighten, darken, saturate, de saturate, grayscale, rotate(hue) return the color bake object. can be lossless by using CIE xyz, lab, lchab. converting to them, then back
 * todo brightness, isLight, isDark functions
 * todo complementary colors
 * todo deltaE, deltaE76 functions
 * todo contrast function
 */
