/* @layer tooling-scripts @kind test */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compareVersions } from '@drizztdourden08/brock-thread';
import { describe, expect, it } from 'vitest';

const BUILD = join(import.meta.dirname, '..');
const PACKAGES = join(BUILD, '..');
const VERSION_FOLDER = /^\d+\.\d+\.\d+$/;

const changelogs = () =>
  readdirSync(PACKAGES, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(PACKAGES, entry.name, 'CHANGELOG.md'))
    .flatMap((file) => {
      try {
        return [readFileSync(file, 'utf8')];
      } catch {
        return [];
      }
    });

const sections = () =>
  changelogs().flatMap((text) => text.split(/^## /m).slice(1).map((block) => ({ version: block.split('\n')[0].trim(), body: block })));

const migrations = () => {
  const dir = join(BUILD, 'migrations');
  return readdirSync(dir)
    .filter((folder) => VERSION_FOLDER.test(folder))
    .flatMap((folder) =>
      readdirSync(join(dir, folder))
        .filter((name) => name.endsWith('.mjs'))
        .map((name) => ({ folder, name, id: /\bid: '([^']+)'/.exec(readFileSync(join(dir, folder, name), 'utf8'))?.[1] ?? null })));
};

const shippedWith = (id, all) => {
  const mentions = all.filter(({ version, body }) => VERSION_FOLDER.test(version) && body.includes(id)).map(({ version }) => version);
  return mentions.sort(compareVersions)[0] ?? null;
};

describe('the version folder of a migration', () => {
  it('is not older than the release whose changelog first names it', () => {
    const all = sections();
    const found = migrations().map((migration) => ({ ...migration, shipped: migration.id ? shippedWith(migration.id, all) : null })).filter(({ shipped }) => shipped);
    expect(found.length).toBeGreaterThan(0);
    const early = found.filter(({ folder, shipped }) => compareVersions(folder, shipped) < 0).map(({ folder, name, shipped }) => `${folder}/${name} shipped in ${shipped}`);
    expect(early).toEqual([]);
  });
});
