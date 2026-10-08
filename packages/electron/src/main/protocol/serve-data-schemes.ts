/* @layer electron-main @kind logic */
import type { PrivilegedScheme } from '@drizztdourden08/brock-core/product';
import { serveDirectoryScheme } from './serve-directory-scheme';

const serveDataSchemes = (schemes: readonly PrivilegedScheme[], dataPath: (...segments: string[]) => string): void => {
  const served = new Set<string>();
  for (const { scheme, dir } of schemes) {
    if (dir === undefined || served.has(scheme)) continue;
    served.add(scheme);
    serveDirectoryScheme(scheme, () => dataPath(...dir.split(/[\\/]+/)));
  }
};

export { serveDataSchemes };
