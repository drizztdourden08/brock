/* @layer core @kind constants */
const RATIO_EPSILON = 1e-6;

const FALLBACK_WIDTH = 16;
const FALLBACK_HEIGHT = 9;

const COMMON_RATIOS: readonly [readonly [number, number], ...(readonly [number, number])[]] = [
  [1, 1], [5, 4], [4, 3], [3, 2], [16, 10], [5, 3], [16, 9], [17, 9], [18, 9], [19, 9], [32, 15], [20, 9], [21, 9],
];

export { RATIO_EPSILON, FALLBACK_WIDTH, FALLBACK_HEIGHT, COMMON_RATIOS };
