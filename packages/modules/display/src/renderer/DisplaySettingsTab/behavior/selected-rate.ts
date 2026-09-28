/* @layer renderer-shell @kind logic */
const selectedRate = (preferred: number, available: number[]): number => {
  if (preferred > 0 && available.includes(preferred)) return preferred;
  return available.at(-1) ?? 0;
};

export { selectedRate };
