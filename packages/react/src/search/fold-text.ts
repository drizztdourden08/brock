/* @layer renderer-shell @kind logic */
const foldText = (text: string): string => text.normalize('NFD').replace(/\p{M}+/gu, '').toLowerCase();

export { foldText };
