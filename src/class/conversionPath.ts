import { ColorBake, Converters } from "../colorBake.js";
import { ColorRegistry } from "../types.js";

export function getBestConversionPath<From extends keyof ColorRegistry>(
  convert: Converters,
  from: From,
  to: keyof ColorRegistry
) {
  const defaultPaths = {
    current: [],
    best: [],
  };
  const paths = getBestConversionPathX(convert, from, to, defaultPaths);
  return paths.best;
}

export function getBestConversionPathX<From extends keyof ColorRegistry>(
  convert: Converters,
  from: From,
  to: keyof ColorRegistry,
  paths: { current: string[]; best: string[] }
): { current: string[]; best: string[] } {
  if (paths.current.length === 0) {
    paths.current.push(from);
  }
  const convertFrom = convert[from];
  if (!convertFrom) return paths;
  if (convertFrom[to]) {
    paths.current.push(to);
    return paths;
  }
  for (const spaceName of Object.keys(convertFrom)) {
    if (paths.current.includes(spaceName)) continue;
    paths.current.push(spaceName);
    paths = getBestConversionPathX(
      convert,
      spaceName as keyof ColorRegistry,
      to,
      paths
    );
    if (paths.current[paths.current.length - 1] === to) {
      paths.best = getBestPathByCoverage([...paths.best], [...paths.current]);
      for (
        let a = paths.current.length - 1;
        a > paths.current.indexOf(spaceName);
        a--
      ) {
        paths.current.pop();
      }
      paths.current.pop();
    } else {
      // required to properly iterate when path has not been found
      paths.current.pop();
    }
  }
  return paths;
}

export function getBestPathByCoverage(bestPath: string[], path: string[]) {
  if (bestPath.length === 0) return path;
  const bestCoverages: number[] = [];
  const coverages: number[] = [];
  for (const key of bestPath) {
    const space = ColorBake.prototype.spaces[key as keyof ColorRegistry];
    if (!space) return bestPath; //! or maybe push 0
    bestCoverages.push(space.coverage);
  }
  for (const key of path) {
    const space = ColorBake.prototype.spaces[key as keyof ColorRegistry];
    if (!space) return bestPath; //! or maybe push 0
    coverages.push(space.coverage);
  }
  if (Math.min(...coverages) > Math.min(...bestCoverages)) {
    return path;
  }
  return bestPath;
}

export function sortConvertKeysByCoverage(convertKeys: string[]) {
  const coverages: number[] = [];
  for (const key of convertKeys) {
    const space = ColorBake.prototype.spaces[key as keyof ColorRegistry];
    if (!space) return convertKeys; //! or maybe push 0
    coverages.push(space.coverage);
  }
  const sortable: [[string, number]] = [["", 0]];
  sortable.pop(); //! Typescript trickery
  for (const [a, convertKey] of convertKeys.entries()) {
    sortable.push([convertKey, coverages[a] || 0]);
  }
  // Descending sort function
  sortable.sort(function (a: [string, number], b: [string, number]) {
    return b[1] - a[1];
  });
  const sorted: string[] = [];
  for (const sort of sortable) {
    sorted.push(sort[0]);
  }
  return sorted;
}
