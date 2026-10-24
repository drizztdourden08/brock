/* @layer renderer-shell @kind logic */
const isAskChannel = (decl: unknown): boolean => typeof decl === 'object' && decl !== null && Reflect.get(decl, 'kind') === 'ask';

export { isAskChannel };
