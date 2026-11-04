/* @layer core @kind logic */
const wireList = <T>(value: readonly T[] | undefined): T[] => (Array.isArray(value) ? [...value] : []);

export { wireList };
