export const rgbManipulations = {
  lighten: function (
    rgb: {
      r: number;
      g: number;
      b: number;
    },
    percent: number
  ) {
    console.log(rgb, percent, "light color");
    return rgb;
  },
};
export interface RgbManipulations {
  lighten: (
    rgb: {
      r: number;
      g: number;
      b: number;
    },
    percent: number
  ) => {
    r: number;
    g: number;
    b: number;
  };
}
