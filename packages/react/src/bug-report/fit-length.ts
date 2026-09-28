/* @layer renderer-shell @kind logic */
const fitLength = (max: number, fits: (length: number) => boolean): number => {
  if (fits(max)) return max;
  let low = 0;
  let high = max;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (fits(mid)) low = mid;
    else high = mid - 1;
  }
  return low;
};

export { fitLength };
