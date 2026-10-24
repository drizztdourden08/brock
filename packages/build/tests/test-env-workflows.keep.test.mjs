/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const SYSCTL = 'sudo sysctl -w kernel.apparmor_restrict_unprivileged_userns=0';
const BWRAP = 'sudo apt-get update && sudo apt-get install -y --no-install-recommends bubblewrap';
const CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['windows', 'linux'], modules: [] };

const ciOf = (testEnv) => {
  const root = tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
  return renderWorkflows(root, { ...CONFIG, workflows: { testEnv } }, [])[0].content;
};

const stepNames = (ci, job) => parse(ci).jobs[job].steps.map((step) => step.name);

describe('workflows.testEnv of brock.config.ts', () => {
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

  it('adds the sysctl step to the quality job and keeps the review job one', () => {
    const ci = ciOf({ userNamespaces: true, linuxPackages: ['bubblewrap'] });
    const quality = parse(ci).jobs.quality.steps;
        expect(quality.find((step) => step.name === 'Let the tests create user namespaces').run).toBe(SYSCTL);
    expect(quality.find((step) => step.name === 'Install Linux packages').run).toBe(BWRAP);
    expect(parse(ci).jobs.review.steps.find((step) => step.name === 'Let Electron start its sandbox').run).toBe(SYSCTL);
    expect(ci.split(SYSCTL).length - 1).toBe(2);
  });

  it('turns only the user namespace step on for userNamespaces alone', () => {
    const ci = ciOf({ userNamespaces: true });
    expect(stepNames(ci, 'quality')).not.toContain('Install Linux packages');
    expect(stepNames(ci, 'quality')).toContain('Let the tests create user namespaces');
  });
});

describe('workflows.testEnv checks', () => {
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
