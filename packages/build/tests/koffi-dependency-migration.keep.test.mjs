/* @layer tooling-scripts @kind test */
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { migration } from '../migrations/0.117.0/koffi-dependency.mjs';

const dirs = [];

const appWith = (dependencies) => {
  const dir = mkdtempSync(join(tmpdir(), 'brock-koffi-migration-'));
  dirs.push(dir);
  writeFileSync(join(dir, 'package.json'), `${JSON.stringify({ name: 'app', dependencies }, null, 2)}\n`);
  return dir;
};

const dependenciesOf = (dir) => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')).dependencies;

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('K5 the koffi-dependency migration', { tags: ['critical'] }, () => {
  it('adds koffi to an app that uses brock-electron, once', () => {
    const dir = appWith({ '@drizztdourden08/brock-electron': '^0.116.0' });
    const first = migration.workspace({ rootDir: dir });
    expect(first.touched).toEqual(['package.json']);
    expect(dependenciesOf(dir).koffi).toBe('^3.1.2');
    expect(migration.workspace({ rootDir: dir }).touched).toEqual([]);
  });

  it('takes the spec brock-electron declares when it is installed', () => {
    const dir = appWith({ '@drizztdourden08/brock-electron': '^0.116.0' });
    const installed = join(dir, 'node_modules', '@drizztdourden08', 'brock-electron');
    mkdirSync(installed, { recursive: true });
    writeFileSync(join(installed, 'package.json'), JSON.stringify({ dependencies: { koffi: '^3.2.0' } }));
    migration.workspace({ rootDir: dir });
    expect(dependenciesOf(dir).koffi).toBe('^3.2.0');
  });

  it('leaves an app without brock-electron alone', () => {
    const dir = appWith({ react: '^19.0.0' });
    expect(migration.workspace({ rootDir: dir }).touched).toEqual([]);
    expect(dependenciesOf(dir).koffi).toBeUndefined();
  });
});
