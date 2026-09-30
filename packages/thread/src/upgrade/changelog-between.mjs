/* @layer tooling-scripts @kind logic */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { tryGh } from '../gh.mjs';
import { compareVersions } from './compare-versions.mjs';
import { BROCK_PACKAGE, BROCK_REPO, BROCK_SCOPE, BUILD_PACKAGE } from './upgrade.constants.mjs';

const entriesOf = (lines) =>
  lines
    .filter((line) => line.startsWith('- ') && !line.startsWith('- Updated dependencies'))
    .map((line) => line.slice(2).replace(/^[0-9a-f]{7,40}: /, '').trim());

const sectionsOf = (text) =>
  text.replace(/\r\n/g, '\n').split(/^## /m).slice(1).map((chunk) => {
    const [head, ...lines] = chunk.split('\n');
    return { version: head.trim(), entries: entriesOf(lines) };
  });

const installedChangelogs = (dir) => {
  const scopeDir = join(dir, 'node_modules', BROCK_SCOPE);
  if (!existsSync(scopeDir)) return [];
  return readdirSync(scopeDir)
    .filter((name) => BROCK_PACKAGE.test(`${BROCK_SCOPE}/${name}`))
    .map((name) => join(scopeDir, name, 'CHANGELOG.md'))
    .filter((file) => existsSync(file))
    .map((file) => readFileSync(file, 'utf8'));
};

const releaseNotes = (target) => {
  const body = tryGh(['release', 'view', `${BUILD_PACKAGE}@${target}`, '--repo', BROCK_REPO, '--json', 'body', '--jq', '.body']);
  return body ? [{ version: target, entries: entriesOf(body.split(/\r?\n/)) }] : [];
};

const merge = (sections) => {
  const byVersion = new Map();
  for (const { version, entries } of sections) byVersion.set(version, new Set([...(byVersion.get(version) ?? []), ...entries]));
  return [...byVersion].map(([version, entries]) => ({ version, entries: [...entries] }));
};

/**
 * @param {string} dir the upgraded checkout, after install
 * @param {{ from: string | null, to: string, online: boolean }} range
 * @returns {{ version: string, entries: string[] }[]} oldest first
 */
const changelogBetween = (dir, { from, to, online }) => {
  const inRange = ({ version }) => (from === null || compareVersions(version, from) > 0) && compareVersions(version, to) <= 0;
  const installed = installedChangelogs(dir).flatMap(sectionsOf).filter(inRange);
  const sections = installed.length > 0 || !online ? installed : releaseNotes(to).filter(inRange);
  return merge(sections).sort((a, b) => compareVersions(a.version, b.version));
};

export { changelogBetween };
