/* @layer renderer-shell @kind logic */
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const sameSlice = (a: unknown, b: unknown): boolean => {
  if (Object.is(a, b)) return true;
  if (!isRecord(a) || !isRecord(b)) return false;
  const keys = Object.keys(a);
  return keys.length === Object.keys(b).length && keys.every((key) => key in b && Object.is(a[key], b[key]));
};

export { sameSlice };
