/* @layer core @kind logic */
const settlePosition = (settled: Set<number>, index: number, saved: number): number => {
  if (index < saved) return saved;
  settled.add(index);
  let next = saved;
  while (settled.delete(next)) next += 1;
  return next;
};

export { settlePosition };
