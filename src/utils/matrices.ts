export function invert3x3Matrix(matrix: Matrix3x3): Matrix3x3 {
  /* eslint-disable unicorn/prevent-abbreviations */
  const a = matrix[0][0];
  const b = matrix[0][1];
  const c = matrix[0][2];
  const d = matrix[1][0];
  const e = matrix[1][1];
  const f = matrix[1][2];
  const g = matrix[2][0];
  const h = matrix[2][1];
  const i = matrix[2][2];

  const determinant =
    a * (e * i - f * h) - b * (i * d - f * g) + c * (d * h - e * g);

  return [
    [
      (e * i - f * h) / determinant,
      (c * h - b * i) / determinant,
      (b * f - c * e) / determinant,
    ],
    [
      (f * g - d * i) / determinant,
      (a * i - c * g) / determinant,
      (c * d - a * f) / determinant,
    ],
    [
      (d * h - e * g) / determinant,
      (b * g - a * h) / determinant,
      (a * e - b * d) / determinant,
    ],
  ];

  /* eslint-enable unicorn/prevent-abbreviations */
}

export function multiply3x3matrix3x1(m1: Matrix3x3, m2: Matrix3x1): Matrix3x1 {
  return [
    [m1[0][0] * m2[0][0] + m1[0][1] * m2[1][0] + m1[0][2] * m2[2][0]],
    [m1[1][0] * m2[0][0] + m1[1][1] * m2[1][0] + m1[1][2] * m2[2][0]],
    [m1[2][0] * m2[0][0] + m1[2][1] * m2[1][0] + m1[2][2] * m2[2][0]],
  ];
}

export function multiply3x3matrix3x3(m1: Matrix3x3, m2: Matrix3x3): Matrix3x3 {
  const a = m1[0][0];
  const b = m1[0][1];
  const c = m1[0][2];
  const p = m1[1][0];
  const q = m1[1][1];
  const r = m1[1][2];
  const u = m1[2][0];
  const v = m1[2][1];
  const w = m1[2][2];

  const alpha = m2[0][0];
  const beta = m2[0][1];
  const gamma = m2[0][2];
  const lambda = m2[1][0];
  const mu = m2[1][1];
  const nu = m2[1][2];
  const rho = m2[2][0];
  const sigma = m2[2][1];
  const tau = m2[2][2];

  return [
    [
      a * alpha + b * lambda + c * rho,
      a * beta + b * mu + c * sigma,
      a * gamma + b * nu + c * tau,
    ],
    [
      p * alpha + q * lambda + r * rho,
      p * beta + q * mu + r * sigma,
      p * gamma + q * nu + r * tau,
    ],
    [
      u * alpha + v * lambda + w * rho,
      u * beta + v * mu + w * sigma,
      u * gamma + v * nu + w * tau,
    ],
  ];
}

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

export type MatrixRow3 = [number, number, number];

export type MatrixRow1 = [number];

export type Matrix3x3 = [MatrixRow3, MatrixRow3, MatrixRow3];

export type Matrix3x1 = [MatrixRow1, MatrixRow1, MatrixRow1];
