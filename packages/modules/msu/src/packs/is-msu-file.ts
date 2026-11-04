/* @layer core @kind logic */
const isMsuFile = (name: string): boolean => /\.(pcm|opuz|msu)$/i.test(name);

export { isMsuFile };
