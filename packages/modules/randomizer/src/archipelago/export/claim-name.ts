/* @layer core @kind logic */
const claimName = (names: Set<string>, name: string, what: 'items' | 'locations'): void => {
  if (names.has(name)) throw new Error(`two ${what} named ${name}`);
  names.add(name);
};

export { claimName };
