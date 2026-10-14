/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { collectWorkflowSteps } from '../src/release/collect-workflow-steps.mjs';
import { composeWorkflows, workspaceCi } from '../src/release/compose-workflows.mjs';

const app = (workflows) => collectWorkflowSteps([{ label: 'brock.config.ts workflows.steps', workflows }]);

const STEPS = app({
  ci: {
    beforeInstall: [{ name: 'Set up a toolchain', uses: 'example/setup-toolchain@v3', with: { version: '4.0.10', cache: true } }],
    beforeBuild: [{ name: 'Build the core', run: 'pnpm run core:build\npnpm run core:check', shell: 'bash' }],
    afterBuild: [{ name: 'Emit the data file', run: 'pnpm run data:emit' }],
    beforeTest: [{ name: 'Fetch the dataset', run: 'pnpm run data:fetch', secrets: ['DATASET_TOKEN'], env: { MODE: 'ci' } }],
  },
  release: {
    beforeInstall: [{ name: 'Linux packages', run: 'sudo apt-get install -y zip', os: 'linux' }],
    beforePackage: [{ name: 'Windows only', run: 'echo win', os: 'windows' }, { name: 'Web only', run: 'echo web', platforms: ['web'] }],
    afterPackage: [{ name: 'Ship the data file', run: 'cp "$APP_DIR/out/data.bin" upload/', platforms: ['windows', 'linux'] }],
  },
});

const stepNames = (job) => job.steps.map((step) => step.name ?? step.uses);

const between = (names, first, last) => names.slice(names.indexOf(first) + 1, names.indexOf(last));

describe('app workflow steps in the CI workflow', () => {
  const ci = parse(composeWorkflows({ targets: ['desktop', 'web'], prefix: 'a-', steps: STEPS }).ci);

  it('splices each step point into the quality job, in order', () => {
    const names = stepNames(ci.jobs.quality);
    expect(between(names, 'actions/checkout@v7', 'pnpm/action-setup@v6')).toEqual(['Set up a toolchain']);
    expect(between(names, 'Install', 'Build')).toEqual(['Build the core']);
    expect(between(names, 'Build', 'Release note')).toEqual(['Emit the data file', 'Fetch the dataset']);
  });

  it('gives the review job the install and build steps, not the test steps', () => {
    const names = stepNames(ci.jobs.review);
    expect(names).toEqual(expect.arrayContaining(['Set up a toolchain', 'Build the core', 'Emit the data file']));
    expect(names).not.toContain('Fetch the dataset');
    expect(between(stepNames(ci.jobs.web), 'Install', 'Build the web app')).toEqual(['Build the core']);
  });

  it('writes uses with its inputs, a shell script as a block, and each secret as an env variable', () => {
    const steps = ci.jobs.quality.steps;
    expect(steps.find((step) => step.name === 'Set up a toolchain')).toEqual({ name: 'Set up a toolchain', uses: 'example/setup-toolchain@v3', with: { version: '4.0.10', cache: true } });
    expect(steps.find((step) => step.name === 'Build the core')).toMatchObject({ shell: 'bash', run: 'pnpm run core:build\npnpm run core:check\n' });
    expect(steps.find((step) => step.name === 'Fetch the dataset').env).toEqual({ DATASET_TOKEN: '${{ secrets.DATASET_TOKEN }}', MODE: 'ci' });
  });
});

describe('app workflow steps in the release workflow', () => {
  const release = parse(composeWorkflows({ targets: ['desktop', 'web'], prefix: 'a-', steps: STEPS }).release);

  it('runs a step only on its runners and in its platforms', () => {
    expect(stepNames(release.jobs['build-windows'])).toContain('Windows only');
    expect(stepNames(release.jobs['build-linux'])).not.toContain('Windows only');
    expect(stepNames(release.jobs['build-web'])).toContain('Web only');
    expect(stepNames(release.jobs['build-macos'])).not.toContain('Web only');
    expect(stepNames(release.jobs['build-macos'])).not.toContain('Ship the data file');
    expect(stepNames(release.jobs.prepare)).toContain('Linux packages');
    expect(stepNames(release.jobs['build-windows'])).not.toContain('Linux packages');
  });

  it('packs after the delta fetch and the beforePackage steps, and ships afterPackage files with the release', () => {
    const names = stepNames(release.jobs['build-windows']);
    expect(between(names, 'Fetch the previous release', 'Package')).toEqual(['Windows only']);
    expect(between(names, 'Collect the release files', 'actions/upload-artifact@v7')).toEqual(['Ship the data file']);
    expect(between(stepNames(release.jobs['build-web']), 'Install', 'Build the web app')).toEqual(['Web only']);
  });

  it('writes the same workflows as before when the app has no steps', () => {
    const none = composeWorkflows({ targets: ['desktop', 'android', 'web'], prefix: 'a-', steps: app(undefined) });
    expect(none).toEqual(composeWorkflows({ targets: ['desktop', 'android', 'web'], prefix: 'a-' }));
    expect(`${none.ci}${none.release}`).not.toMatch(/__[A-Z_]+__/);
  });
});

describe('the workspace ci.yml of several apps', () => {
  it('runs the first app beforeInstall and beforeTest steps with its folder', () => {
    const job = parse(workspaceCi([], 'main', { steps: STEPS, appDir: 'apps/desktop' })).jobs.workspace;
    expect(job.env).toEqual({ APP_DIR: 'apps/desktop' });
    expect(between(stepNames(job), 'Install', 'Managed files match brock sync')).toEqual(['Fetch the dataset']);
    expect(parse(workspaceCi([], 'main')).jobs.workspace.env).toBeUndefined();
  });
});

describe('collectWorkflowSteps', () => {
  it('keeps the order modules, plugins, then the app', () => {
    const step = (name) => ({ ci: { beforeBuild: [{ name, run: 'true' }] } });
    const steps = collectWorkflowSteps([{ label: 'module a', workflows: step('module') }, { label: 'plugin b', workflows: step('plugin') }, { label: 'app', workflows: step('app') }]);
    expect(steps.ci.beforeBuild.map((s) => s.name)).toEqual(['module', 'plugin', 'app']);
  });

  it('names the source and the step of every mistake', () => {
    expect(() => app({ ci: { beforeDeploy: [] } })).toThrow('brock.config.ts workflows.steps.ci: unknown step point "beforeDeploy"; it takes beforeInstall, beforeBuild, afterBuild, beforeTest.');
    expect(() => app({ deploy: {} })).toThrow(/unknown workflow "deploy"/);
    expect(() => app({ ci: { beforeBuild: [{ name: 'x', run: 'a', uses: 'b@v1' }] } })).toThrow('brock.config.ts workflows.steps.ci.beforeBuild[0]: a step takes run (a shell command) or uses (an action), one of the two.');
    expect(() => app({ ci: { beforeBuild: [{ name: 'x', run: 'a', with: { a: 1 } }] } })).toThrow(/with goes with uses/);
    expect(() => app({ ci: { beforeBuild: [{ name: 'x', run: 'a', runs: 'b' }] } })).toThrow(/unknown key runs/);
    expect(() => app({ ci: { beforeBuild: [{ run: 'a' }] } })).toThrow(/name is missing/);
    expect(() => app({ release: { beforePackage: [{ name: 'x', run: 'a', os: 'solaris' }] } })).toThrow(/os takes windows, linux, macos/);
    expect(() => app({ release: { beforePackage: [{ name: 'x', run: 'a', platforms: ['desktop'] }] } })).toThrow(/platforms takes windows, macos, linux, android, ios, web/);
    expect(() => app({ ci: { beforeTest: [{ name: 'x', run: 'a', secrets: ['GITHUB_TOKEN'] }] } })).toThrow(/reserves the GITHUB_ prefix/);
    expect(() => app({ ci: { beforeTest: [{ name: 'x', run: 'a', secrets: ['bad name'] }] } })).toThrow(/is not a secret name/);
  });
});
