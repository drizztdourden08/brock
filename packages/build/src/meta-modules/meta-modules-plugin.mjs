/* @layer tooling-scripts @kind logic */
import { readFileSync } from 'node:fs';
import { loadTypescript } from '../upgrade/tessera/load-typescript.mjs';
import { META_EXPORTS, META_ID, REGISTRY_FILE } from './meta-modules.constants.mjs';
import { rewriteMetaImports } from './rewrite-meta-imports.mjs';
import { stripToExports } from './strip-to-exports.mjs';

const fileOf = (id) => id.replace(/[?#].*$/, '').replace(/^\0/, '');

/**
 * @param {{ rootDir: string }} opts the app root, whose TypeScript comes first
 * @returns {import('vite').Plugin} serves `<file>?brock-meta`, the file's meta alone
 */
const metaModulesPlugin = ({ rootDir }) => {
  let ts;
  const compiler = () => {
    ts ??= loadTypescript(rootDir) ?? null;
    return ts;
  };
  return {
    name: 'brock-meta-modules',
    enforce: 'pre',
    transform(code, id) {
      if (!REGISTRY_FILE.test(id.replace(/[?#].*$/, ''))) return null;
      const rewritten = rewriteMetaImports(code);
      return rewritten === code ? null : { code: rewritten, map: null };
    },
    load(id) {
      if (!META_ID.test(id)) return null;
      const file = fileOf(id);
      const typescript = compiler();
      if (!typescript) return null;
      this.addWatchFile(file);
      return stripToExports(typescript, file, readFileSync(file, 'utf8'), META_EXPORTS)?.code ?? null;
    },
  };
};

export { metaModulesPlugin };
