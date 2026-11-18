/* @layer core @kind logic */
const mergeParts = <T>(parts: readonly unknown[]): (string | T)[] => {
  const out: unknown[] = [];
  for (const part of parts) {
    const last = out.length - 1;
    if (typeof part === 'string' && typeof out[last] === 'string') {
      out[last] = `${out[last]}${part}`;
    } else {
      out.push(part);
    }
  }
  return out as (string | T)[];
};

export { mergeParts };
