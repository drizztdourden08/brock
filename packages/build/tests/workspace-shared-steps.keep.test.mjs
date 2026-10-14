/* @layer tooling-scripts @kind test */
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { loadBrockConfig } from '../src/load-config.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { workflowInputs } from '../src/release/workspace-workflow-inputs.mjs';
import { brockWorkspace, removeTempRepos } from './temp-repo.mjs';

afterEach(removeTempRepos);

const SETUP = "{ name: 'Set up the toolchain', uses: 'owner/setup-toolchain@v3', with: { version: '4' } }";

const appConfig = (id, test) => `export default { product: { id: '${id}', name: '${id}', releaseTagPrefix: '${id}-v' }, targets: ['linux'], modules: [], workflows: { steps: { ci: { beforeInstall: [${SETUP}], beforeTest: [${test}] } } } };\n`;

const twoApps = (files = {}) => brockWorkspace({
  'apps/desktop/brock.config.ts': appConfig('desktop', "{ name: 'Fetch the data', run: 'pnpm run data:fetch', secrets: ['DATA_TOKEN'] }"),
  'apps/tools/brock.config.ts': appConfig('tools', "{ name: 'Check the tools', run: 'pnpm run tools:check' }"),
  'apps/tools/package.json': '{ "name": "@atlas/tools", "version": "0.1.0" }\n',
  '.tools/tools/brock-plugin-cores/index.mjs': "export default { name: 'cores', verbs: {}, workflows: { ci: { beforeTest: [{ name: 'Build the cores', run: 'make cores' }] } } };\n",
  ...files,
});

const render = async (root, app) => {
  const dir = join(root, app);
  return renderWorkflows(dir, await loadBrockConfig(dir), [], await workflowInputs(dir));
};

const between = (names, first, last) => names.slice(names.indexOf(first) + 1, names.indexOf(last));

describe('the shared ci.yml of a workspace whose two apps declare steps', () => {
  it('runs the steps of every app, in workspace order, named after the app and in its folder', async () => {
    const root = twoApps();
    const [shared] = await render(root, 'apps/desktop');
    expect(shared.path).toBe('../../.github/workflows/ci.yml');
    const steps = parse(shared.content).jobs.workspace.steps;
    const names = steps.map((step) => step.name ?? step.uses);
    expect(between(names, 'Install', 'Managed files match brock sync')).toEqual(['Build the cores', 'desktop: Fetch the data', 'tools: Check the tools']);
    expect(steps.find((step) => step.name === 'desktop: Fetch the data')).toMatchObject({
      'working-directory': 'apps/desktop',
      env: { APP_DIR: 'apps/desktop', DATA_TOKEN: '${{ secrets.DATA_TOKEN }}' },
    });
    expect(steps.find((step) => step.name === 'tools: Check the tools')['working-directory']).toBe('apps/tools');
    expect(steps.find((step) => step.name === 'Build the cores')['working-directory']).toBeUndefined();
  });

  it('runs a setup step that both apps declare once', async () => {
    const steps = parse((await render(twoApps(), 'apps/desktop'))[0].content).jobs.workspace.steps;
    expect(steps.filter((step) => step.uses === 'owner/setup-toolchain@v3')).toEqual([{ name: 'desktop: Set up the toolchain', uses: 'owner/setup-toolchain@v3', with: { version: '4' } }]);
  });

  it('keeps each app own steps in its own ci file, unnamed and without a working directory', async () => {
    const files = await render(twoApps(), 'apps/tools');
    expect(files.map((file) => file.path)).toEqual(['../../.github/workflows/ci-tools.yml', '../../.github/workflows/release-tools.yml']);
    const quality = parse(files[0].content).jobs.quality.steps;
    expect(quality.map((step) => step.name)).toEqual(expect.arrayContaining(['Check the tools', 'Build the cores']));
    expect(quality.map((step) => step.name)).not.toContain('Fetch the data');
    expect(quality.find((step) => step.name === 'Check the tools')['working-directory']).toBeUndefined();
  });

  it('leaves the shared ci.yml alone when brock.workspace.mjs owns it', async () => {
    const root = twoApps({ 'brock.workspace.mjs': "export default { name: 'atlas', workflows: { ci: 'own' }, plugins: [] };\n" });
    const inputs = await workflowInputs(join(root, 'apps/desktop'));
    expect(inputs.sharedWorkflows).toEqual({ ci: 'own' });
    expect(inputs.workspaceApps.map((app) => app.appDir)).toEqual(['apps/desktop', 'apps/tools']);
    expect((await render(root, 'apps/desktop')).map((file) => file.path)).toEqual(['../../.github/workflows/ci-desktop.yml', '../../.github/workflows/release-desktop.yml']);
  });
});
