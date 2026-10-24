/* @layer electron-main @kind logic */
const hasSequence = (segments: string[], sequence: readonly string[]): boolean =>
  segments.some((_segment, index) => sequence.every((name, offset) => segments[index + offset] === name));

export { hasSequence };
