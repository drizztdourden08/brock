/* @layer renderer-shell @kind logic */
const insideDeadzone = (x: number, y: number, radius: number | undefined): boolean =>
  radius !== undefined && Math.hypot(x, y) < radius;

export { insideDeadzone };
