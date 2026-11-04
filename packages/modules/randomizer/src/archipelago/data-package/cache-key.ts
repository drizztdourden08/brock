/* @layer core @kind logic */
const cacheKey = (prefix: string, game: string, checksum: string): string => `${prefix}${game}.${checksum}`;

export { cacheKey };
