/* @layer renderer-shell @kind logic */
const ids = new Set<string>();

const volumeItems = {
  add: (id: string): void => { ids.add(id); },
  list: (): string[] => [...ids],
};

export { volumeItems };
