/* @layer tooling-scripts @kind logic */
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generatedFiles } from '@drizztdourden08/brock-lint-config/generated-files';

const COUNT = 'GIT_CONFIG_COUNT';

const restore = (name, value) => {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
};

/**
 * @template T
 * @param {string} rootDir
 * @param {() => T} body
 * @returns {T}
 */
const withGeneratedFilesExcluded = (rootDir, body) => {
  const files = generatedFiles(rootDir);
  if (files.length === 0) return body();
  const dir = mkdtempSync(join(tmpdir(), 'brock-prose-'));
  const excludes = join(dir, 'exclude');
  writeFileSync(excludes, `${files.map((path) => `/${path}`).join('\n')}\n`, 'utf8');
  const count = process.env[COUNT];
  const keyName = `GIT_CONFIG_KEY_${Number(count ?? 0)}`;
  const valueName = `GIT_CONFIG_VALUE_${Number(count ?? 0)}`;
  const saved = [process.env[keyName], process.env[valueName]];
  process.env[COUNT] = String(Number(count ?? 0) + 1);
  process.env[keyName] = 'core.excludesFile';
  process.env[valueName] = excludes;
  try {
    return body();
  } finally {
    restore(COUNT, count);
    restore(keyName, saved[0]);
    restore(valueName, saved[1]);
    rmSync(dir, { recursive: true, force: true });
  }
};

export { withGeneratedFilesExcluded };
