/* @layer renderer-shell @kind logic */
const stepMenu = (from: number, delta: number, count: number): number => (from + delta + count) % count;

export { stepMenu };
