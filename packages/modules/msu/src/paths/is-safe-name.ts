/* @layer core @kind logic */
const isSafeName = (name: string): boolean =>
  name.length > 0 && !name.includes('..') && !name.includes('/') && !name.includes('\\');

export { isSafeName };
