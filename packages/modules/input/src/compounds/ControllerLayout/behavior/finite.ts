/* @layer renderer-shell @kind logic */
const finite = (value: number | undefined): number => (typeof value === 'number' && Number.isFinite(value) ? value : 0);

export { finite };
