/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { ESLint } from 'eslint';
import { brockEslint } from '../eslint.mjs';

const roots = new Set();

const tempDir = () => roots.add(mkdtempSync(join(tmpdir(), 'brock-data-kind-'))) && [...roots].at(-1);

const put = (root, path, content) => {
  const file = join(root, ...path.split('/'));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, content, 'utf8');
};

const removeRoots = () => {
  roots.forEach((root) => rmSync(root, { recursive: true, force: true }));
  roots.clear();
};

const header = (kind) => `/* @layer shared-game @kind ${kind} */\n`;

/**
 * @param {string} root
 * @param {string} file
 * @returns {Promise<{ ruleId: string, message: string }[]>} the messages of brockEslint on the file
 */
const lintMessages = async (root, file) => {
  const eslint = new ESLint({ cwd: root, overrideConfigFile: true, overrideConfig: brockEslint({ rootDir: root, typed: false }) });
  const [result] = await eslint.lintFiles([join(root, file)]);
  return result.messages.map(({ ruleId, message }) => ({ ruleId, message }));
};

const lintRules = async (root, file) => (await lintMessages(root, file)).map((message) => message.ruleId);

const app = () => {
  const root = tempDir();
  put(root, 'package.json', JSON.stringify({ name: 'data-kind-fixture', private: true, type: 'module' }));
  put(root, 'records/tag-record.type.ts', `${header('types')}interface TagRecord { id: string }\n\nexport type { TagRecord };\n`);
  put(root, 'records/base-tags.constants.ts', `${header('constants')}const BASE_TAGS = [] as const;\n\nexport { BASE_TAGS };\n`);
  return root;
};

const LINT_TIMEOUT_MS = 60000;

export { LINT_TIMEOUT_MS, app, header, lintMessages, lintRules, put, removeRoots, tempDir };
