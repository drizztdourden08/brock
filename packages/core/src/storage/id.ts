/* @layer core @kind logic */
const newId = (): string => globalThis.crypto.randomUUID().slice(0, 8);

export { newId };
