/* @layer core @kind logic */
const composeMaps = <A extends object, B extends object>(a: A, b: B): A & B => ({ ...a, ...b });

export { composeMaps };
