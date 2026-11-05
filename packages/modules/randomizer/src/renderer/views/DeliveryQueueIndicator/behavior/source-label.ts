/* @layer renderer-shell @kind logic */
const sourceLabel = (source: string): string => (source.includes(':') ? source.split(':').slice(1).join(':') : source);

export { sourceLabel };
