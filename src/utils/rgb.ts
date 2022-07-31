/**
 * Converts a xx
 */ export function linearizeRgbChannel(channel: number): number {
  return channel > 0.040_45
    ? Math.pow((channel + 0.055) / 1.055, 2.4)
    : channel / 12.92;
}

/**
 * Converts a linearized RGB channel value to
 */
export function unlinearizeRgbChannel(channel: number): number {
  return channel > 0.003_130_8
    ? 1.055 * Math.pow(channel, 1 / 2.4) - 0.055
    : 12.92 * channel;
}
