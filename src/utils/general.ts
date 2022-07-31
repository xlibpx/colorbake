export function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function clamp(input: number, min: number, max: number) {
  return Math.min(Math.max(input, min), max);
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const shallowCompare = (
  object1: { [key: string]: string | number | undefined },
  object2: { [key: string]: string | number | undefined }
): boolean =>
  Object.keys(object1).length === Object.keys(object2).length &&
  Object.keys(object1).every(
    (key) =>
      Object.prototype.hasOwnProperty.call(object2, key) &&
      object1[key] === object2[key]
  );
