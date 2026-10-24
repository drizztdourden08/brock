/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { GITHUB_REMOTE, ORIGIN_SECTION, REMOTE_URL, REPOSITORY_SHORTHAND } from './publish-packages.constants.mjs';

const originUrl = (repoDir) => {
  const config = join(repoDir, '.git', 'config');
  if (!existsSync(config) || !statSync(config).isFile()) return null;
  const lines = readFileSync(config, 'utf8').split(/\r?\n/).map((line) => line.trim());
  const start = lines.findIndex((line) => ORIGIN_SECTION.test(line));
  if (start === -1) return null;
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith('[')) return null;
    const url = REMOTE_URL.exec(line);
    if (url) return url[1];
  }
  return null;
};

const repositoryUrl = (repoDir) => {
  const file = join(repoDir, 'package.json');
  if (!existsSync(file)) return null;
  const { repository } = JSON.parse(readFileSync(file, 'utf8'));
  const url = typeof repository === 'string' ? repository : repository?.url;
  if (typeof url !== 'string') return null;
  return REPOSITORY_SHORTHAND.test(url) ? `github.com/${url}` : url.replace(/^github:/, 'github.com/');
};

/**
 * @param {string} repoDir the repo root
 * @returns {string | null} the lower case GitHub owner, or null
 */
const repoOwnerOf = (repoDir) => {
  const match = [originUrl(repoDir), repositoryUrl(repoDir)].map((url) => (url ? GITHUB_REMOTE.exec(url) : null)).find(Boolean);
  return match ? match[1].toLowerCase() : null;
};

export { repoOwnerOf };
