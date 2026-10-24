/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { runStructure } from '../src/commands/structure.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(() => {
  vi.restoreAllMocks();
  removeTempRepos();
});

const library = (name) => `${JSON.stringify({ name, version: '1.0.0', exports: './index.ts' })}\n`;

const config = (publish) => `export default { product: { id: 'archipelia', name: 'Archipelia' }, workflows: { publish: { packages: ${JSON.stringify(publish)} } } };\n`;

const repo = (names, publish = ['packages/client-kit']) => tempRepo({
  '.git/HEAD': 'ref: refs/heads/main\n',
  '.git/config': '[remote "origin"]\n\turl = https://github.com/drizztdourden08/archipelia.git\n',
  'package.json': '{ "name": "@archipelia/root" }\n',
  'pnpm-workspace.yaml': "packages:\n  - 'packages/*'\n",
  'brock.config.ts': config(publish),
  'packages/client-kit/package.json': library(names.kit),
  'packages/client-kit/index.ts': '',
  'packages/lobby-core/package.json': library(names.core ?? '@archipelia/lobby-core'),
  'packages/lobby-core/index.ts': '',
});

const structureOf = async (root) => {
  const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
  const code = await runStructure({ rootDir: root });
  return { code, errors: errors.mock.calls.flat() };
};

describe('package names under workflows.publish', () => {
  it('names a published package @<owner>/<app>-<subject> and every other package @<app>/<subject>', async () => {
    const { code, errors } = await structureOf(repo({ kit: '@drizztdourden08/archipelia-client-kit' }));
    expect(errors).toEqual([]);
    expect(code).toBe(0);
  });

  it('refuses the app form on a published package and names the published form', async () => {
    const { code, errors } = await structureOf(repo({ kit: '@archipelia/client-kit' }));
    expect(code).toBe(1);
    expect(errors.join('\n')).toContain('packages/client-kit: name "@archipelia/client-kit" is not "@drizztdourden08/archipelia-client-kit"; a package in workflows.publish is named @<owner>/<app>-<subject>');
    expect(errors.join('\n')).not.toContain('is not "@archipelia/<subject>"');
  });

  it('refuses a wrong subject on a published package', async () => {
    const { code, errors } = await structureOf(repo({ kit: '@drizztdourden08/client-kit' }));
    expect(code).toBe(1);
    expect(errors.join('\n')).toContain('is not "@drizztdourden08/archipelia-client-kit"');
  });

  it('keeps @<app>/<subject> for a package that is not listed, and names that form', async () => {
    const { code, errors } = await structureOf(repo({ kit: '@drizztdourden08/archipelia-client-kit', core: '@drizztdourden08/archipelia-lobby-core' }));
    expect(code).toBe(1);
    expect(errors.join('\n')).toContain('packages/lobby-core: name "@drizztdourden08/archipelia-lobby-core" is not "@archipelia/<subject>"');
  });

  it('keeps the app scope on every package when nothing is published', async () => {
    const { code, errors } = await structureOf(repo({ kit: '@archipelia/client-kit' }, []));
    expect(errors).toEqual([]);
    expect(code).toBe(0);
  });
});
