/* @layer electron-main @kind logic */
const spansOverlap = (aStart: number, aLength: number, bStart: number, bLength: number): boolean =>
  aStart < bStart + bLength && bStart < aStart + aLength;

export { spansOverlap };
