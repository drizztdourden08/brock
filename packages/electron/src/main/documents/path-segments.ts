/* @layer electron-main @kind logic */
const pathSegments = (path: string): string[] => path.toLowerCase().split(/[\\/]/).filter((segment) => segment !== '');

export { pathSegments };
