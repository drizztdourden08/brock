/* @layer core @kind logic */
const armedSummary = (counts: Record<string, number>): string =>
  Object.entries(counts).map(([name, count]) => `${count} ${name}`).join(', ');

export { armedSummary };
