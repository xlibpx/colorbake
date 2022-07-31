import { ColorBake } from "../colorBake.js";
import {
  ColorBakeInput,
  ColorObject,
  ColorObjectInput,
  ColorRegistry,
  KeysNotMatching,
  KeysOfUnion,
  UnionToIntersection,
} from "../types.js";

export function colorBakeInputToColorObject(
  input: ColorBakeInput
): ColorObject<keyof ColorRegistry> {
  if (typeof input === "string") {
    return parseColor(input);
  } else if (Array.isArray(input)) {
    const type: KeysNotMatching<ColorRegistry, string> = input[0];
    const color: number[] = [];
    for (let a = 1; a < input.length; a++) {
      color.push(input[a] as number);
    }
    const colorObject: ColorObjectInput = { type: type, color: color };
    return ensureProperColorObject(colorObject);
  }
  return ensureProperColorObject(input);
}

export function parseColor(input: string): ColorObject<keyof ColorRegistry> {
  if (input.startsWith("#")) {
    return { type: "hex", color: input };
  }
  const typeMatch = input.match(/^[\w-]+(?=\()/g) || [];
  let typeName = "";
  if (typeMatch[0]) {
    typeName = typeMatch[0];
  }
  if (typeName === "color") {
    const typeMatch = input.match(/(?<=^color\()[\w-]+/g) || [];
    if (typeMatch[0]) {
      typeName = typeMatch[0];
    }
  }
  const type = ColorBake.prototype.names[typeName.toLowerCase()] || "";
  //todo handle error(blank string)
  const colorArrayMatch: string[] = input.match(/(?<!\w)(\d+\.?\d+)/g) || [];
  const colorArray: number[] = [];
  for (const channel of colorArrayMatch) {
    colorArray.push(+channel);
  }
  const colorObject: ColorObjectInput = {
    type: type as KeysNotMatching<ColorRegistry, string>,
    color: colorArray,
  };
  return ensureProperColorObject(colorObject);
}

export function ensureProperColorObject<T extends keyof ColorRegistry>(
  input: ColorObjectInput
): ColorObject<keyof ColorRegistry> {
  if (!Array.isArray(input.color) || typeof input.color === "string") {
    return input;
  }
  const color: UnionToIntersection<
    Exclude<ColorRegistry[keyof ColorRegistry], string>
  > = {
    ...(ColorBake.prototype.spaces[input.type]?.initial as UnionToIntersection<
      Exclude<ColorRegistry[keyof ColorRegistry], string>
    >),
  };
  if (typeof color === "object") {
    for (let a = 0; a < input.color.length; a++) {
      const g = Object.keys(color)[a] as KeysOfUnion<
        Exclude<ColorRegistry[keyof ColorRegistry], string>
      >;
      color[g] = input.color[a] || 0;
    }
  }
  return {
    type: input.type as T,
    color: color as ColorRegistry[T],
  };
}
