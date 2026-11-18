/* @layer core @kind logic */
const cleanPreference = (value: unknown): string | null => (typeof value === 'string' && value.length > 0 ? value : null);

export { cleanPreference };
