/* @layer electron-main @kind logic */
const isUnrecorded = (options: unknown): boolean =>
  typeof options === 'object' && options !== null && (options as { recent?: unknown }).recent === false;

export { isUnrecorded };
