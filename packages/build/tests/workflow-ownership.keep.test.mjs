/* @layer tooling-scripts @kind test */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { definePlugin } from '@drizztdourden08/brock-thread';
import { syncApp } from '../src/modules/sync.mjs';
import { pluginWorkflowSteps } from '../src/release/plugin-workflow-steps.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { brockWorkspace, removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['windows', 'linux'], modules: [] };
const standalone = () => tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
const paths = (files) => files.map((file) => file.path);

describe('workflows.ci and workflows.release of brock.config.ts', () => {
  it('leaves a workflow the app owns out of sync, and keeps the other managed', () => {
    const root = standalone();
    expect(paths(renderWorkflows(root, { ...CONFIG, workflows: { ci: 'own' } }, []))).toEqual(['.github/workflows/release.yml']);
    expect(paths(renderWorkflows(root, { ...CONFIG, workflows: { release: 'own' } }, []))).toEqual(['.github/workflows/ci.yml']);
    expect(paths(renderWorkflows(root, { ...CONFIG, workflows: { ci: 'managed', release: 'managed' } }, []))).toEqual(['.github/workflows/ci.yml', '.github/workflows/release.yml']);
  });

  it('never rewrites nor checks a workflow the app owns', () => {
    const root = standalone();
    const owned = { ...CONFIG, workflows: { release: 'own' } };
    syncApp(root, owned, { onMissing: 'skip' });
    writeFileSync(join(root, '.github/workflows/release.yml'), 'name: Our own release\n');
    expect(syncApp(root, owned, { check: true, onMissing: 'skip' }).drifted).not.toContain('.github/workflows/release.yml');
    expect(syncApp(root, CONFIG, { check: true, onMissing: 'skip' }).drifted).toContain('.github/workflows/release.yml');
  });

  it('keeps the workspace ci.yml with the first app ci', () => {
    const twoApps = brockWorkspace({ 'apps/tools/brock.config.ts': '', 'apps/tools/package.json': '{ "name": "@atlas/tools", "version": "0.1.0" }\n' });
    const config = { ...CONFIG, product: { ...CONFIG.product, releaseTagPrefix: 'desktop-v' } };
    expect(paths(renderWorkflows(join(twoApps, 'apps/desktop'), config, []))).toContain('../../.github/workflows/ci.yml');
    expect(paths(renderWorkflows(join(twoApps, 'apps/desktop'), { ...config, workflows: { ci: 'own' } }, []))).toEqual(['../../.github/workflows/release-desktop.yml']);
  });

  it('refuses a mode it does not know', () => {
    expect(() => renderWorkflows(standalone(), { ...CONFIG, workflows: { ci: 'manual' } }, [])).toThrow("brock.config.ts workflows.ci is 'manual'; it takes 'managed' or 'own'.");
  });
});

describe('a repo that releases from another base branch', () => {
  it('runs CI on a push to the base and moves the base, not the GitHub default branch, after a release', () => {
    const root = brockWorkspace({ 'brock.workspace.mjs': "export default { name: 'atlas', base: 'integration' };\n" });
    const [ci, release] = renderWorkflows(join(root, 'apps/desktop'), CONFIG, []).map((file) => file.content);
    expect(parse(ci).on.push.branches).toEqual(['integration']);
    const tagStep = parse(release).jobs.release.steps.find((step) => step.name === 'Commit the version and tag it');
    expect(tagStep.env.BRANCH).toBe('integration');
    expect(release).not.toContain('github.event.repository.default_branch');
  });

  it('keeps the Velopack delta fetch and the small installer in every desktop build', () => {
    const release = parse(renderWorkflows(standalone(), CONFIG, [])[1].content);
    for (const job of ['build-windows', 'build-linux']) {
      const names = release.jobs[job].steps.map((step) => step.name);
      expect(names.indexOf('Fetch the previous release')).toBeLessThan(names.indexOf('Package'));
    }
    expect(release.jobs['build-windows'].steps.find((step) => step.name === 'Package').run).toContain('brock package $FULL');
  });
});

describe('workflow steps from the plugins of the repo command', () => {
  it('keeps workflows in definePlugin', () => {
    const workflows = { ci: { beforeBuild: [{ name: 'Plugin step', run: 'true' }] } };
    expect(definePlugin({ name: 'cores', verbs: {}, workflows }).workflows).toBe(workflows);
    expect(definePlugin({ name: 'cores', verbs: {} })).not.toHaveProperty('workflows');
  });

  it('loads them from the repo plugins and splices them before the app steps', async () => {
    const root = tempRepo({
      '.git/HEAD': 'ref: refs/heads/main\n',
      'brock.config.ts': '',
      '.tools/tools/brock-plugin-cores/index.mjs': "export default { name: 'cores', verbs: {}, workflows: { ci: { beforeBuild: [{ name: 'Build the cores', run: 'make cores' }] } } };\n",
    });
    const pluginSteps = await pluginWorkflowSteps(root);
    expect(pluginSteps).toEqual([{ label: 'plugin cores workflows', workflows: { ci: { beforeBuild: [{ name: 'Build the cores', run: 'make cores' }] } } }]);
    const config = { ...CONFIG, workflows: { steps: { ci: { beforeBuild: [{ name: 'App step', run: 'true' }] } } } };
    const quality = parse(renderWorkflows(root, config, [], { pluginSteps })[0].content).jobs.quality.steps.map((step) => step.name);
    expect(quality.slice(quality.indexOf('Install') + 1, quality.indexOf('Build'))).toEqual(['Build the cores', 'App step']);
  });
});
