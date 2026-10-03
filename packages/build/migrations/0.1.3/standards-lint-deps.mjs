/* @layer tooling-scripts @kind logic */
import { basename } from 'node:path';

const CARRIED = Object.freeze(['eslint-plugin-react-hooks', 'typescript-eslint']);
const STANDARDS = '@drizztdourden08/standards';
const LINT_PRESET = '@drizztdourden08/brock-lint-config';

const indentOf = (source) => source.match(/^\{\r?\n([ \t]+)"/)?.[1] ?? '  ';
const write = (source, data) => `${JSON.stringify(data, null, indentOf(source))}\n`;

const packageJson = (source) => {
  const data = JSON.parse(source);
  const dev = data.devDependencies ?? {};
  if (!dev[LINT_PRESET] || !CARRIED.some((name) => name in dev)) return source;
  data.devDependencies = Object.fromEntries(Object.entries(dev).filter(([name]) => !CARRIED.includes(name)));
  return write(source, data);
};

const knipJson = (source) => {
  const data = JSON.parse(source);
  const ignored = data.ignoreDependencies ?? [];
  if (ignored.includes(STANDARDS)) return source;
  data.ignoreDependencies = [STANDARDS, ...ignored];
  return write(source, data);
};

const CATALOG_LINE = new RegExp(`^[ \t]+['"]?(?:${CARRIED.join('|')})['"]?:.*\r?\n`, 'gm');

const workspaceYaml = (source) => source.replace(CATALOG_LINE, '');

const EDITS = Object.freeze({ 'knip.json': knipJson, 'pnpm-workspace.yaml': workspaceYaml });

const apply = ({ path, source }) => ({ source: (EDITS[basename(path)] ?? packageJson)(source), todos: [] });

const migration = Object.freeze({
  id: 'standards-lint-deps',
  summary: 'brock-lint-config now sits on @drizztdourden08/standards, which carries typescript-eslint and eslint-plugin-react-hooks: an app drops them from devDependencies and its pnpm catalog, and knip ignores standards, whose stylelint plugins it sees through the lint config.',
  files: /(^|\/)((package|knip)\.json|pnpm-workspace\.yaml)$/,
  apply,
});

export { migration };
