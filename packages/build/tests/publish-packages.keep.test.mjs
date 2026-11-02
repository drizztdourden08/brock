/* @layer tooling-scripts @kind test */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { syncApp } from '../src/modules/sync.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const PRODUCT = { id: 'atlas', name: 'Atlas' };
const REGISTRY = 'https://npm.pkg.github.com';

const manifest = (fields) => `${JSON.stringify({ version: '1.2.0', publishConfig: { registry: REGISTRY }, ...fields })}\n`;

const files = (extra = {}) => ({
  '.git/HEAD': 'ref: refs/heads/main\n',
  '.git/config': '[remote "origin"]\n\turl = https://github.com/Atlas-Games/atlas.git\n',
  'pnpm-workspace.yaml': "packages:\n  - 'packages/*'\n  - 'tools/*'\n",
  'brock.config.ts': '',
  'packages/lobby-protocol/package.json': manifest({ name: '@atlas-games/lobby-protocol', scripts: { build: 'tsc' } }),
  'packages/client-kit/package.json': manifest({ name: '@atlas-games/client-kit' }),
  ...extra,
});

const releaseOf = (publish, extra = {}) => {
  const config = { product: PRODUCT, targets: ['desktop'], modules: [], workflows: { publish } };
  const written = renderWorkflows(tempRepo(files(extra)), config, []);
  const text = written.find((entry) => entry.path.endsWith('release.yml')).content;
  return { text, workflow: parse(text) };
};

const stepOf = (job, name) => job.steps.find((step) => step.name === name);

describe('K1 workflows.publish', { tags: ['critical'] }, () => {
  const { workflow } = releaseOf({ packages: ['packages/lobby-protocol', 'packages/client-kit'] });
  const job = workflow.jobs['publish-packages'];

  it('grants contents read and packages write to that job only', () => {
    expect(job.permissions).toEqual({ contents: 'read', packages: 'write' });
    expect(workflow.permissions).toEqual({ contents: 'write', packages: 'read' });
    expect(workflow.jobs.release.permissions).toBeUndefined();
  });

  it('builds a package that has a build script and leaves out one that has none', () => {
    const names = job.steps.map((step) => step.name);
    expect(stepOf(job, 'Build @atlas-games/lobby-protocol')).toMatchObject({ 'working-directory': 'packages/lobby-protocol', run: 'pnpm run build' });
    expect(names).not.toContain('Build @atlas-games/client-kit');
    expect(names.indexOf('Build @atlas-games/lobby-protocol')).toBeLessThan(names.indexOf('Publish @atlas-games/lobby-protocol'));
  });

  it('publishes each package in the listed order with the workflow token, once per version', () => {
    const publishes = job.steps.filter((step) => step.name?.startsWith('Publish '));
    expect(publishes.map((step) => step.name)).toEqual(['Publish @atlas-games/lobby-protocol', 'Publish @atlas-games/client-kit']);
    const [first] = publishes;
    expect(first['working-directory']).toBe('packages/lobby-protocol');
    expect(first.env).toEqual({ NODE_AUTH_TOKEN: '${{ secrets.GITHUB_TOKEN }}', PACKAGE_NAME: '@atlas-games/lobby-protocol' });
    expect(first.run).toContain('npm view "$PACKAGE_NAME@$VERSION" version');
    expect(first.run).toContain(`pnpm publish --no-git-checks --registry ${REGISTRY}`);
    expect(first.run.indexOf('npm view')).toBeLessThan(first.run.indexOf('pnpm publish'));
  });

  it('adds no job when the app publishes nothing', () => {
    expect(releaseOf(undefined).workflow.jobs['publish-packages']).toBeUndefined();
  });

  it('reads the owner from package.json repository when the repo has no origin remote', () => {
    const { workflow: fromManifest } = releaseOf(
      { packages: ['packages/client-kit'] },
      { '.git/config': '', 'package.json': '{ "repository": "github:Atlas-Games/atlas" }\n' },
    );
    expect(Object.keys(fromManifest.jobs)).toContain('publish-packages');
  });
});

describe('K4 workflows.publish refusals', { tags: ['critical'] }, () => {
  const refused = (publish, extra, pattern) => expect(() => releaseOf(publish, extra)).toThrow(pattern);

  it('refuses a path that is not a workspace package', () => {
    refused({ packages: ['packages/missing'] }, {}, /workflows\.publish: packages\/missing is not a workspace package/);
    refused({ packages: ['docs'] }, { 'docs/package.json': manifest({ name: '@atlas-games/docs' }) }, /docs is not a workspace package/);
    refused({ packages: ['../outside'] }, {}, /is not a folder inside the repo/);
  });

  it('refuses a private package and says how to fix it', () => {
    refused(
      { packages: ['packages/client-kit'] },
      { 'packages/client-kit/package.json': manifest({ name: '@atlas-games/client-kit', private: true }) },
      /@atlas-games\/client-kit \(packages\/client-kit\) is private: true.*Remove private from packages\/client-kit\/package\.json/,
    );
  });

  it('refuses a scope other than the repo owner and says how to rename', () => {
    refused(
      { packages: ['packages/client-kit'] },
      { 'packages/client-kit/package.json': manifest({ name: '@other/client-kit' }) },
      /has @other, and GitHub Packages only takes the repo owner's scope @atlas-games\. Rename it to @atlas-games\/client-kit/,
    );
    refused(
      { packages: ['packages/client-kit'] },
      { 'packages/client-kit/package.json': manifest({ name: 'client-kit' }) },
      /has no scope.*Rename it to @atlas-games\/client-kit/,
    );
  });

  it('refuses a package without a publishConfig.registry on npm.pkg.github.com', () => {
    const name = '@atlas-games/client-kit';
    const pattern = /no publishConfig\.registry set to https:\/\/npm\.pkg\.github\.com\. Add "publishConfig": \{ "registry": "https:\/\/npm\.pkg\.github\.com" \}/;
    refused({ packages: ['packages/client-kit'] }, { 'packages/client-kit/package.json': JSON.stringify({ name, version: '1.0.0' }) }, pattern);
    refused({ packages: ['packages/client-kit'] }, { 'packages/client-kit/package.json': manifest({ name, publishConfig: { registry: 'https://registry.npmjs.org' } }) }, pattern);
  });

  it('refuses a malformed setting, a repeat and an unknown owner', () => {
    refused({ packages: [] }, {}, /packages is a list of workspace package folders/);
    refused({ packages: ['packages/client-kit'], registry: 'npm' }, {}, /registry takes 'github'/);
    refused({ packages: ['packages/client-kit'], extra: true }, {}, /unknown key extra/);
    refused({ packages: ['packages/client-kit', 'packages/client-kit/'] }, {}, /packages\/client-kit is listed twice/);
    refused({ packages: ['packages/client-kit'] }, { '.git/config': '' }, /cannot tell the repo owner/);
  });
});

const PACKAGES = ['packages/lobby-protocol', 'packages/client-kit'];
const standaloneOf = (publish, extra = {}) => {
  const config = { product: PRODUCT, targets: ['desktop'], modules: [], workflows: { publish } };
  const written = renderWorkflows(tempRepo(files(extra)), config, []);
  return { paths: written.map((entry) => entry.path), entry: written.find((entry) => entry.path.endsWith('publish-packages.yml')) };
};
const { entry } = standaloneOf({ packages: PACKAGES });
const workflow = parse(entry.content);
const job = workflow.jobs['publish-packages'];

describe('K2 the publish-packages workflow', { tags: ['critical'] }, () => {
  it('is written next to release.yml and triggered by workflow_dispatch with an optional packages input', () => {
    expect(entry.path).toBe('.github/workflows/publish-packages.yml');
    expect(Object.keys(workflow.on)).toEqual(['workflow_dispatch']);
    expect(workflow.on.workflow_dispatch.inputs.packages).toMatchObject({ required: false, default: '', type: 'string' });
    expect(workflow.on.workflow_dispatch.inputs.packages.description).toContain(PACKAGES.join(', '));
    expect(Object.keys(workflow.jobs)).toEqual(['publish-packages']);
  });
});

describe('E2 the package selection of the publish-packages workflow', { tags: ['e2e'] }, () => {
  const select = (requested) => {
    const step = stepOf(job, 'Select packages');
    const output = join(tempRepo({ 'github-output': '' }), 'github-output').replaceAll('\\', '/');
    const run = spawnSync('bash', ['-c', step.run], {
      encoding: 'utf8', env: { ...process.env, GITHUB_OUTPUT: output, REQUESTED: requested, ALLOWED: step.env.ALLOWED, LISTED: step.env.LISTED },
    });
    return { status: run.status, stdout: run.stdout, output: readFileSync(output, 'utf8') };
  };

  it('selects every package for an empty input and only the named ones otherwise', () => {
    expect(select('').output).toBe('folders=,packages/lobby-protocol,packages/client-kit,\n');
    expect(select(' packages/client-kit/ ').output).toBe('folders=,packages/client-kit,\n');
    expect(select('packages/client-kit,packages/lobby-protocol').output).toBe('folders=,packages/client-kit,packages/lobby-protocol,\n');
  });

  it('refuses a folder that is not in workflows.publish and says which are', () => {
    const run = select('packages/client-kit,packages/other');
    expect(run.status).toBe(1);
    expect(run.stdout).toContain('::error title=Unknown package::packages/other is not in workflows.publish of brock.config.ts. Use one or more of: packages/lobby-protocol, packages/client-kit.');
    expect(select('tools/x').status).toBe(1);
  });
});

describe('K3 the publish-packages workflow file', { tags: ['critical'] }, () => {
  it('is absent when the app publishes nothing, which leaves the workflow set unchanged', () => {
    expect(standaloneOf(undefined).paths).toEqual(['.github/workflows/ci.yml', '.github/workflows/release.yml']);
    expect(standaloneOf({ packages: PACKAGES }).paths).toEqual(['.github/workflows/ci.yml', '.github/workflows/release.yml', '.github/workflows/publish-packages.yml']);
  });

  it('is compared by brock check like the other managed workflows', () => {
    const config = { product: PRODUCT, targets: ['desktop'], modules: [], workflows: { publish: { packages: PACKAGES } } };
    const root = tempRepo(files());
    syncApp(root, config, { onMissing: 'skip' });
    expect(syncApp(root, config, { check: true, onMissing: 'skip' }).drifted).not.toContain('.github/workflows/publish-packages.yml');
    writeFileSync(join(root, '.github/workflows/publish-packages.yml'), 'name: edited\n');
    expect(syncApp(root, config, { check: true, onMissing: 'skip' }).drifted).toContain('.github/workflows/publish-packages.yml');
  });
});
