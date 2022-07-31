import { handleDifferentIlluminants } from "./class/chromaticAdaptation.js";
import { getBestConversionPath } from "./class/conversionPath.js";
import { colorBakeInputToColorObject } from "./class/input.js";
import { roundColor } from "./class/round.js";
//ColorBake.prototype.whitePoints = { d65: { x: 0, y: 0, z: 0 } };
//console.log(ColorBake.prototype.whitePoints, "=====");
import {
  ColorBakeInput,
  ColorObject,
  ColorRegistry,
  ColorSpace,
  ToOptions,
  UnionToIntersection,
  WhitePoint,
} from "./types.js";

//todo give variables proper names
export class ColorBake {
  public color: ColorObject<keyof ColorRegistry>;
  public whitePoints: WhitePoints = ColorBake.prototype.whitePoints;
  public spaces: Spaces = ColorBake.prototype.spaces;
  public converters: Converters = ColorBake.prototype.converters;
  public stringBuilders: StringBuilders = ColorBake.prototype.stringBuilders;
  public names: Names = ColorBake.prototype.names;
  public deltaEMethods: DeltaEMethods = ColorBake.prototype.deltaEMethods;

  constructor(input: ColorBakeInput) {
    //this.color = { type: "rgb", color: { r: 0, g: 0, b: 0 } };
    this.color = colorBakeInputToColorObject(input);
  }

  // generate a random color
  public random() {
    return { r: 0, g: 0, b: 0 };
  }

  public to<From extends keyof ColorRegistry, To extends keyof ColorRegistry>(
    toSpace: To,
    options: ToOptions = {}
  ): ColorRegistry[To] {
    if (this.color.type === toSpace) {
      return roundColor(
        this.color.color as ColorRegistry[To],
        options,
        toSpace
      ) as ColorRegistry[To];
    }
    const from = this.converters[this.color.type as From];
    if (!from) {
      return ColorBake.prototype.spaces[toSpace]?.initial as ColorRegistry[To]; //? Assumes it exists
    }

    const conversionFunction = from[toSpace];
    let color = {};
    if (conversionFunction) {
      color = conversionFunction(
        this.color.color as ColorRegistry[From],
        options
      );
    } else {
      //todo Figure out why this is so much slower than the above if statement
      const conversionPath = getBestConversionPath(
        this.converters,
        this.color.type,
        toSpace
      );
      // If conversion not found return the initial color (Black)
      if (conversionPath.length === 0) {
        console.error(
          "Conversion from " +
            this.color.type +
            " to " +
            toSpace +
            " was not found."
        );
        return ColorBake.prototype.spaces[toSpace]
          ?.initial as ColorRegistry[To]; //? Assumes it exists
      }
      console.log(conversionPath, "090909"); //! Debug
      let colorBeingConverted = this.color.color as UnionToIntersection<
        ColorRegistry[keyof ColorRegistry]
      >;
      let fromSpace = this.color.type;
      conversionPath.shift(); // removes first from array, converts space to same space if left in.
      let a = 0;
      for (const convertTo of conversionPath) {
        const f = this.converters[fromSpace];
        //console.log(f, from, convertTo);
        if (!f) continue;
        const conversionFunction = f[convertTo as keyof Converters];
        if (!conversionFunction) continue;
        colorBeingConverted = conversionFunction(
          colorBeingConverted,
          options
        ) as UnionToIntersection<ColorRegistry[keyof ColorRegistry]>;
        //colorBeingConverted = handleOutOfRange(
        //  colorBeingConverted as ColorRegistry[keyof ColorRegistry],
        // convertTo as keyof ColorRegistry
        //) as UnionToIntersection<ColorRegistry[keyof ColorRegistry]>;
        colorBeingConverted = handleDifferentIlluminants(
          colorBeingConverted as ColorRegistry[keyof ColorRegistry],
          fromSpace,
          convertTo as keyof ColorRegistry,
          conversionPath[a + 1] as keyof ColorRegistry | undefined
        ) as UnionToIntersection<ColorRegistry[keyof ColorRegistry]>;
        a++;
        fromSpace = convertTo as keyof ColorRegistry;
      }
      color = colorBeingConverted;
    }
    color = roundColor(
      color as ColorRegistry[To],
      options,
      toSpace
    ) as ColorRegistry[To];
    return color as ColorRegistry[To];

    //todo support return as color+alpha, so like return RgbaColor if an alpha is present
  }

  public toString<To extends keyof ColorRegistry>(
    toSpace: To = this.color.type as To,
    options: ToOptions = {}
  ): string {
    const color = this.to(toSpace, options);

    const stringBuilder = this.stringBuilders[toSpace];
    if (!stringBuilder) return "";
    return stringBuilder(color, options);
  }
  //public deltaE(sampleColor: ColorBakeInput, { method = "2000" } = {}): number {
  //  const deltaEFunction = this.deltaEMethods["deltaE" + method];
  //  return deltaEFunction(this.color as ColorBakeInput, sampleColor);
  //}
}

export default function colorBake(
  //input: ColorObjectInput | [keyof ColorRegistry, ...number[]] | string
  input: ColorBakeInput
) {
  return new ColorBake(input);
}

//todo Temporary
/**
 * https://en.wikipedia.org/wiki/Standard_illuminant
 */
ColorBake.prototype.whitePoints = {
  2: {
    a: { x: 0.447_57, y: 0.407_45 },
    b: { x: 0.348_42, y: 0.351_61 },
    c: { x: 0.310_06, y: 0.316_16 },
    d50: { x: 0.345_67, y: 0.3585 },
    d55: { x: 0.332_42, y: 0.347_43 },
    d65: { x: 0.312_71, y: 0.329_02 },
    d75: { x: 0.299_02, y: 0.314_85 },
    d93: { x: 0.283_15, y: 0.297_11 },
    e: { x: 0.333_33, y: 0.333_33 },
  },
  10: {
    a: { x: 0.451_17, y: 0.405_94 },
    b: { x: 0.3498, y: 0.3527 },
    c: { x: 0.310_39, y: 0.319_05 },
    d50: { x: 0.347_73, y: 0.359_52 },
    d55: { x: 0.334_11, y: 0.348_77 },
    d65: { x: 0.313_82, y: 0.331 },
    d75: { x: 0.299_68, y: 0.3174 },
    d93: { x: 0.283_27, y: 0.300_43 },
    e: { x: 0.333_33, y: 0.333_33 },
  },
};
ColorBake.prototype.spaces = {};
ColorBake.prototype.converters = {};
ColorBake.prototype.stringBuilders = {};
ColorBake.prototype.names = {};
ColorBake.prototype.deltaEMethods = {};

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type WhitePoints = {
  [key: number]: { [key: string]: WhitePoint };
  "2": { d65: WhitePoint; d50: WhitePoint; [key: string]: WhitePoint };
};
export type Spaces = { [key in keyof ColorRegistry]?: ColorSpace<key> };
export type Converters = {
  [From in keyof ColorRegistry]?: {
    [To in keyof ColorRegistry]?: (
      color: ColorRegistry[From],
      options?: ToOptions
    ) => ColorRegistry[To];
  };
};
export type StringBuilders = {
  [K in keyof ColorRegistry]?: (
    color: ColorRegistry[K],
    options?: ToOptions
  ) => string;
};
export type Names = { [key: string]: keyof ColorRegistry };

export type DeltaEMethods = {
  [key: string]: DeltaEMethod;
};

export type DeltaEMethod = (
  sampleColor: ColorBakeInput,
  referenceColor: ColorBakeInput
) => number;
