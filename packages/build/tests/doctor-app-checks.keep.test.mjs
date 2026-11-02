/* @layer tooling-scripts @kind test */
import { resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { driftCheck } from '../src/doctor/drift-check.mjs';
import { linksCheck } from '../src/doctor/links-check.mjs';
import { runAppChecks } from '../src/doctor/run-app-checks.mjs';
import { undeclaredCheck } from '../src/doctor/undeclared-check.mjs';
import { versionsCheck } from '../src/doctor/versions-check.mjs';
import { tempTree } from './temp-tree.mjs';

const { tempDir, put, cleanup } = tempTree('brock-doctor-app-');

afterEach(cleanup);

const SCOPE = '@drizztdourden08';

const appWith = (files) => {
  const root = tempDir();
  Object.entries(files).forEach(([path, content]) => put(root, path, typeof content === 'string' ? content : JSON.stringify(content)));
  return root;
};

const installed = (name, version) => ({ [`node_modules/${name}/package.json`]: { name, version } });

describe('K1 doctor versions', { tags: ['critical'] }, () => {
  const files = (reactHave, coreHave) => ({
    'package.json': { name: 'app', dependencies: { [`${SCOPE}/brock-react`]: '^0.116.0', [`${SCOPE}/brock-core`]: '^0.116.0', zustand: '^5.0.0' } },
    ...installed(`${SCOPE}/brock-react`, reactHave),
    ...installed(`${SCOPE}/brock-core`, coreHave),
  });

  it('names a package outside its declared range and gives the install fix', () => {
    const { problems } = versionsCheck.run({ rootDir: appWith(files('0.115.0', '0.116.2')) });
    expect(problems.some((line) => line.startsWith(`${SCOPE}/brock-react 0.115.0 is installed but package.json wants ^0.116.0. Fix: pnpm install`))).toBe(true);
    expect(problems.some((line) => line.includes('core'))).toBe(false);
  });

  it('names a brock package that sits off the release line of the others', () => {
    const { problems } = versionsCheck.run({ rootDir: appWith(files('0.116.0', '0.116.2')) });
    expect(problems).toEqual([`${SCOPE}/brock-react 0.116.0 is off the release line 0.116.2 of the other brock packages. Fix: pnpm up "${SCOPE}/brock-react@0.116.2".`]);
  });

  it('is quiet when the versions fit and agree, and skips a package that is linked', () => {
    expect(versionsCheck.run({ rootDir: appWith(files('0.116.1', '0.116.1')) }).problems).toEqual([]);
    const linked = { ...files('0.99.0', '0.99.0'), 'package.json': { name: 'app', dependencies: { [`${SCOPE}/brock-react`]: 'link:../react' } } };
    expect(versionsCheck.run({ rootDir: appWith(linked) }).problems).toEqual([]);
  });
});

describe('K2 doctor links', { tags: ['critical'] }, () => {
  const linkedApp = () => appWith({
    'package.json': { name: 'app', dependencies: { [`${SCOPE}/tessera`]: 'link:../tessera-gone' } },
    'pnpm-workspace.yaml': `overrides:\n  '${SCOPE}/brock-core': link:../core-gone\n  '${SCOPE}/brock-react': file:./local.tgz\n`,
    'local.tgz': 'tarball',
  });

  it('reports a link whose folder is missing, with its target and where it is set', () => {
    const rootDir = linkedApp();
    const { problems } = linksCheck.run({ rootDir });
    expect(problems).toHaveLength(2);
    expect(problems[0]).toContain(`${SCOPE}/tessera is linked to ${resolve(rootDir, '../tessera-gone')} (link:../tessera-gone in package.json), which does not exist.`);
    expect(problems[1]).toContain(`${SCOPE}/brock-core is linked to ${resolve(rootDir, '../core-gone')}`);
    expect(problems[1]).toContain('in pnpm-workspace.yaml');
    expect(problems[1]).toContain('then pnpm install');
  });

  it('accepts a link whose target exists and an app with no links', () => {
    const rootDir = appWith({ 'package.json': { name: 'app', dependencies: { shared: 'link:./shared' } }, 'shared/package.json': '{}' });
    expect(linksCheck.run({ rootDir }).problems).toEqual([]);
    expect(linksCheck.run({ rootDir: appWith({ 'package.json': { name: 'app' } }) })).toMatchObject({ problems: [], detail: 'no linked dependencies' });
  });
});

describe('K3 doctor generated files', { tags: ['critical'] }, () => {
  it('lists generated files that differ from what brock sync writes, with the fix', async () => {
    const rootDir = appWith({ 'package.json': { name: 'fixture', type: 'module' }, 'brock.config.ts': '' });
    const config = { product: { id: 'fixture', name: 'Fixture' }, targets: ['server'], modules: [] };
    const { problems } = await driftCheck.run({ rootDir, config });
    expect(problems).toContain('tsconfig.json differs from what brock sync writes. Fix: brock sync.');
    expect(problems.every((line) => line.endsWith('Fix: brock sync.'))).toBe(true);
  });

  it('has nothing to compare in an app with no brock.config.ts', async () => {
    const { problems } = await driftCheck.run({ rootDir: appWith({ 'package.json': { name: 'app' } }), config: null });
    expect(problems).toEqual([]);
  });
});

describe('K4 doctor imports', { tags: ['critical'] }, () => {
  const source = [
    "import { useState } from 'react';",
    "import local from './local';",
    "import type { Thing } from '@alias/thing';",
    "import left from 'left-pad';",
    "import { readFileSync } from 'node:fs';",
    "export * from '@scope/pkg';",
    "const lazy = () => import('lazy-lib/sub');",
    '',
  ].join('\n');

  const appSource = () => appWith({
    'package.json': { name: 'app', dependencies: { react: '^19.0.0' } },
    'src/main.ts': source,
    'src/more.ts': "import pad from 'left-pad';\n",
    'src/main.test.ts': "import { it } from 'vitest';\n",
  });

  it('names each package the source imports without declaring it, with the file and the fix', () => {
    const { problems } = undeclaredCheck.run({ rootDir: appSource(), config: { build: { aliases: { '@alias': 'src/alias' } } } });
    expect(problems).toEqual([
      'left-pad is imported by src/main.ts and 1 more but is not in package.json. Fix: pnpm add left-pad.',
      '@scope/pkg is imported by src/main.ts but is not in package.json. Fix: pnpm add @scope/pkg.',
      'lazy-lib is imported by src/main.ts but is not in package.json. Fix: pnpm add lazy-lib.',
    ]);
  });
});

describe('K5 doctor app checks together', { tags: ['critical'] }, () => {
  it('prints one ok line per check and passes on a clean app', async () => {
    const { ok, lines } = await runAppChecks({ rootDir: appWith({ 'package.json': { name: 'app', dependencies: {} } }), config: null });
    expect(ok).toBe(true);
    expect(lines).toHaveLength(4);
    expect(lines.every((line) => line.startsWith('  ok '))).toBe(true);
  });

  it('prints one problem line per problem and fails', async () => {
    const rootDir = appWith({ 'package.json': { name: 'app' }, 'src/main.ts': "import left from 'left-pad';\n" });
    const { ok, lines } = await runAppChecks({ rootDir, config: null });
    expect(ok).toBe(false);
    expect(lines.filter((line) => line.startsWith('  problem '))).toHaveLength(1);
    expect(lines.join('\n')).toContain('Fix: pnpm add left-pad.');
  });
});
