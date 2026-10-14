/* @layer electron-main @kind barrel */
export { initPaths } from '../main/paths/init-paths';
export { getUserDataPath } from '../main/paths/get-user-data-path';
export { getLegacyPath } from '../main/paths/get-legacy-path';
export { ensureDataDirectories } from '../main/paths/ensure-data-directories';
export { resolveDataPath } from '../main/files/resolve-data-path';
export { readJsonFile } from '../main/files/read-json-file';
export { writeJsonFile } from '../main/files/write-json-file';
export { createNodeFileStore } from '../main/files/node-file-store';
export type { NodeFileStoreOptions } from '../main/files/node-file-store.type';
