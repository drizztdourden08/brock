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

describe('steps for one job and the prepare job', () => {
  const steps = app({
    ci: {
      beforeInstall: [{ name: 'Review fonts', run: 'sudo apt-get install -y fonts-noto', jobs: 'review' }],
      beforeBuild: [{ name: 'Quality only', run: 'echo q', jobs: ['quality'] }, { name: 'Web and review', run: 'echo w', jobs: ['web', 'review'] }],
      afterBuild: [{ name: 'Everywhere', run: 'echo all' }],
    },
    release: {
      prepare: [{ name: 'Check the save format', run: 'pnpm run saves:check' }],
      beforePackage: [{ name: 'Linux job only', run: 'echo l', jobs: 'build-linux' }],
    },
  });
  const { ci, release } = composeWorkflows({ targets: ['desktop', 'web'], prefix: 'a-', steps });
  const ciJobs = parse(ci).jobs;
  const releaseJobs = parse(release).jobs;

  it('runs a CI step only in the jobs it names', () => {
    expect(stepNames(ciJobs.quality)).toEqual(expect.arrayContaining(['Quality only', 'Everywhere']));
    expect(stepNames(ciJobs.quality)).not.toContain('Web and review');
    expect(stepNames(ciJobs.quality)).not.toContain('Review fonts');
    expect(between(stepNames(ciJobs.review), 'actions/checkout@v7', 'pnpm/action-setup@v6')).toEqual(['Review fonts']);
    expect(between(stepNames(ciJobs.review), 'Install', 'Build')).toEqual(['Web and review']);
    expect(between(stepNames(ciJobs.web), 'Install', 'Build the web app')).toEqual(['Web and review']);
  });

  it('runs release.prepare in the prepare job after the install and before its checks', () => {
    expect(between(stepNames(releaseJobs.prepare), 'Install', 'Release note')).toEqual(['Check the save format']);
    expect(stepNames(releaseJobs['build-windows'])).not.toContain('Check the save format');
    expect(stepNames(releaseJobs['build-linux'])).toContain('Linux job only');
    expect(stepNames(releaseJobs['build-windows'])).not.toContain('Linux job only');
  });

  it('runs a workspace step only when it names the workspace job, or no job', () => {
    const shared = app({ ci: { beforeTest: [{ name: 'Shared', run: 'echo s' }, { name: 'App job only', run: 'echo a', jobs: 'quality' }, { name: 'Workspace', run: 'echo w', jobs: 'workspace' }] } });
    const names = stepNames(parse(workspaceCi([], 'main', shared)).jobs.workspace);
    expect(names).toEqual(expect.arrayContaining(['Shared', 'Workspace']));
    expect(names).not.toContain('App job only');
  });

  it('refuses a job its workflow does not have', () => {
    expect(() => app({ ci: { beforeBuild: [{ name: 'x', run: 'a', jobs: 'build-windows' }] } })).toThrow(/jobs takes changes, quality, review, web, server, workspace/);
    expect(() => app({ release: { prepare: [{ name: 'x', run: 'a', jobs: ['review'] }] } })).toThrow(/jobs takes prepare, build-windows/);
  });
});

describe('a uses step that several sources declare', () => {
  it('runs once per job, while one with other inputs still runs', () => {
    const java = (version) => ({ name: `Java ${version}`, uses: 'actions/setup-java@v6', with: { 'java-version': version } });
    const steps = collectWorkflowSteps([
      { label: 'module a', workflows: { ci: { beforeInstall: [java('21')] } } },
      { label: 'app', workflows: { ci: { beforeInstall: [java('21'), java('17')] } } },
    ]);
    const names = stepNames(parse(composeWorkflows({ targets: ['desktop'], prefix: 'a-', steps }).ci).jobs.quality);
    expect(names.filter((name) => name.startsWith('Java'))).toEqual(['Java 21', 'Java 17']);
  });
});

describe('the Linux runner image', () => {
  it('is pinned to ubuntu-24.04 in every Linux job, never ubuntu-latest', () => {
    const app = { name: 'desktop', tagPrefix: 'desktop-v', notesDir: 'apps/desktop/release-notes' };
    const { ci, release } = composeWorkflows({ targets: ['desktop', 'android', 'web'], prefix: 'a-', appDir: 'apps/desktop', app });
    const text = `${ci}${release}${workspaceCi()}`;
    expect(text).not.toMatch(/runs-on: ubuntu-latest/);
    const linux = [...Object.values(parse(ci).jobs), ...Object.values(parse(release).jobs)].filter((job) => String(job['runs-on']).startsWith('ubuntu'));
    expect(linux.map((job) => job['runs-on'])).toEqual(Array(linux.length).fill('ubuntu-24.04'));
    expect(linux.length).toBe(9);
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
    expect(() => app({ release: { afterRelease: [] } })).toThrow('brock.config.ts workflows.steps.release: unknown step point "afterRelease"; it takes beforeInstall, prepare, beforePackage, afterPackage.');
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
