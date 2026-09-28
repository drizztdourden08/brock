/* @layer electron-main @kind logic */
const asNumber = (value: unknown): number => (typeof value === 'number' ? value : 0);

export { asNumber };
