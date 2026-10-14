/* @layer renderer-shell @kind logic */
const hasWindow = (): boolean => typeof window !== 'undefined';

const readWindowGlobal = (name: string): unknown => {
  if (!hasWindow()) return undefined;
  const value: unknown = Reflect.get(window, name);
  return value;
};

const writeWindowGlobal = (name: string, value: unknown): void => {
  if (hasWindow()) Reflect.set(window, name, value);
};

const deleteWindowGlobal = (name: string): void => {
  if (hasWindow()) Reflect.deleteProperty(window, name);
};

const windowGlobal = { read: readWindowGlobal, write: writeWindowGlobal, remove: deleteWindowGlobal };

export { windowGlobal };
