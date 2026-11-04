/* @layer core @kind logic */
const wireList = <T>(value: readonly T[] | undefined): T[] => (Array.isArray(value) ? Array.from(value as readonly T[]) : []);

export { wireList };
