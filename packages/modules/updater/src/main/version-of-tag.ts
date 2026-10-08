/* @layer electron-main @kind logic */
const versionOfTag = (tag: string, prefix: string): string => (tag.startsWith(prefix) ? tag.slice(prefix.length) : tag);

export { versionOfTag };
