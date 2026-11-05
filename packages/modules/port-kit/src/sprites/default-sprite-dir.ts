/* @layer core @kind logic */
const defaultSpriteDir = (romFile: string): string => `sprites/${romFile.replace(/\.(sfc|smc)$/i, '')}`;

export { defaultSpriteDir };
