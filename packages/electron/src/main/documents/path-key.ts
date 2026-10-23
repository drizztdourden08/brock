/* @layer electron-main @kind logic */
const pathKey = (full: string): string => (process.platform === 'win32' ? full.toLowerCase() : full);

export { pathKey };
