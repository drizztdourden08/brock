/* @layer tooling-scripts @kind entry */
import { storeElectron } from './electron-cache.mjs';

await storeElectron(process.argv[2]).catch(() => 'skipped');
