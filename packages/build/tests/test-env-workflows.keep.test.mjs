/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['windows', 'linux'], modules: [] };

const ciOf = (testEnv) => {
  const root = tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
  return renderWorkflows(root, { ...CONFIG, workflows: { testEnv } }, [])[0].content;
};

const stepNames = (ci, job) => parse(ci).jobs[job].steps.map((step) => step.name);

describe('K2 workflows.testEnv of brock.config.ts', { tags: ['critical'] }, () => {
  it('keeps the ci.yml byte for byte when the app sets neither option', () => {
    const plain = composeWorkflows({ targets: ['desktop'], prefix: 'a-' }).ci;
    expect(composeWorkflows({ targets: ['desktop'], prefix: 'a-', testEnv: { linuxPackages: [], userNamespaces: false } }).ci).toBe(plain);
    expect(ciOf(undefined)).toBe(ciOf({}));
    expect(plain).not.toContain('--no-install-recommends');
  });

  it('installs the packages in the quality job only, before the build', () => {
    const ci = ciOf({ linuxPackages: ['bubblewrap', 'socat'] });
    const quality = stepNames(ci, 'quality');
    expect(quality.indexOf('Install Linux packages')).toBeGreaterThan(quality.indexOf('Install'));
    expect(quality.indexOf('Install Linux packages')).toBeLessThan(quality.indexOf('Build'));
    expect(parse(ci).jobs.quality.steps.find((step) => step.name === 'Install Linux packages').run)
      .toBe('sudo apt-get update && sudo apt-get install -y --no-install-recommends bubblewrap socat');
    expect(stepNames(ci, 'review')).not.toContain('Install Linux packages');
    expect(parse(ci).jobs.quality['runs-on']).toBe('ubuntu-24.04');
  });
});

describe('K4 workflows.testEnv checks', { tags: ['critical'] }, () => {
  it('refuses a package name that is not a Debian package name, as server.osPackages does', () => {
    expect(() => ciOf({ linuxPackages: ['bubblewrap; rm -rf /'] })).toThrow('brock.config.ts workflows.testEnv.linuxPackages has "bubblewrap; rm -rf /", which is not a Debian package name.');
    expect(() => ciOf({ linuxPackages: 'bubblewrap' })).toThrow('workflows.testEnv.linuxPackages is a list.');
  });

  it('refuses an option it does not know and a flag that is not a boolean', () => {
    expect(() => ciOf({ packages: [] })).toThrow('workflows.testEnv has "packages"; it takes linuxPackages and userNamespaces.');
    expect(() => ciOf({ userNamespaces: 'yes' })).toThrow('workflows.testEnv.userNamespaces is true or false.');
  });

  it('leaves workflows.ci own alone: no ci.yml is written, whatever testEnv says', () => {
    const root = tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
    const files = renderWorkflows(root, { ...CONFIG, workflows: { ci: 'own', testEnv: { userNamespaces: true } } }, []);
    expect(files.map((file) => file.path)).toEqual(['.github/workflows/release.yml']);
  });
});
