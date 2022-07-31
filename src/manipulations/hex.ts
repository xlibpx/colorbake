export const hexManipulations: HexManipulations = {
  lighten: (hex: string): string => {
    return hex;
  },
};
/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export interface HexManipulations {
  lighten: (hex: string) => string;
}
