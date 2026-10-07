/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const TSCONFIG = /^tsconfig(?:\.[\w-]+)*\.json$/;
const INCLUDE = /("include"\s*:\s*\[)([^\]]*)(\])/;
const BARE_ENTRY = /(["'])(?:\.\/)?\.brock\/?\1/g;
const GLOB_ENTRY = '".brock/*.ts"';

const tsconfigsOf = (rootDir) => (existsSync(rootDir) ? readdirSync(rootDir, { withFileTypes: true }) : [])
  .filter((entry) => entry.isFile() && TSCONFIG.test(entry.name))
  .map((entry) => entry.name)
  .sort();

const rewrite = (source) => source.replace(INCLUDE, (_, open, entries, close) => `${open}${entries.replace(BARE_ENTRY, GLOB_ENTRY)}${close}`);

const workspace = ({ rootDir }) => {
  const touched = [];
  for (const name of tsconfigsOf(rootDir)) {
    const file = join(rootDir, name);
    const source = readFileSync(file, 'utf8');
    const next = rewrite(source);
    if (next === source) continue;
    writeFileSync(file, next, 'utf8');
    touched.push(name);
  }
  return { touched };
};

const migration = Object.freeze({
  id: 'brock-dir-type-checked',
  summary: 'TypeScript skips dot folders when it expands a folder in include, so ".brock" there matched no file and .brock/tessera-parts.ts, which nothing imports, never reached the program. The include entry becomes ".brock/*.ts" in every tsconfig*.json of the app.',
  workspace,
});

export { migration };
