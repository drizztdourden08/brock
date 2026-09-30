/* @layer tooling-scripts @kind logic */

/**
 * @param {number} width
 * @param {number} height
 * @param {number} angle  CSS degrees: 0 points up, turning clockwise
 * @returns {{ x1: number, y1: number, x2: number, y2: number }}
 */
const gradientLine = (width, height, angle) => {
  const turn = (angle * Math.PI) / 180;
  const dx = Math.sin(turn);
  const dy = -Math.cos(turn);
  const half = (Math.abs(width * dx) + Math.abs(height * dy)) / 2;
  const round = (value) => Number(value.toFixed(2)) + 0;
  return {
    x1: round(width / 2 - dx * half), y1: round(height / 2 - dy * half),
    x2: round(width / 2 + dx * half), y2: round(height / 2 + dy * half),
  };
};

export { gradientLine };
