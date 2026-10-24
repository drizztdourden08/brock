/* @layer electron-main @kind logic */
const optionFlag = (options: unknown, name: string): boolean =>
  typeof options === 'object' && options !== null && (options as Record<string, unknown>)[name] === true;

export { optionFlag };
