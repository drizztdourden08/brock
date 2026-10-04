/* @layer electron-main @kind logic */
const nearestLine = (value: number, lines: readonly number[], reach: number): number => {
  let best = value;
  let gap = reach + 1;
  for (const line of lines) {
    const distance = Math.abs(line - value);
    if (distance < gap) {
      best = line;
      gap = distance;
    }
  }
  return best;
};

export { nearestLine };
