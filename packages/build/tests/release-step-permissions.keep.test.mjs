/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['desktop'], modules: [] };

const releaseOf = (workflows, targets = CONFIG.targets) => {
  const root = tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
  const file = renderWorkflows(root, { ...CONFIG, targets, workflows }, []).find((entry) => entry.path.endsWith('release.yml'));
  return { text: file.content, workflow: parse(file.content) };
};

const stepOf = (job, name) => job.steps.find((step) => step.name === name);

describe('K4 permissions of a release step', { tags: ['critical'] }, () => {
  const steps = { release: { afterPackage: [{ name: 'Sign', run: 'echo sign', jobs: 'build-linux', permissions: { 'id-token': 'write', contents: 'read' } }] } };
  const { workflow } = releaseOf({ steps });

  it('lifts onto the job that runs the step, merged with the workflow permissions, write winning', () => {
    expect(workflow.permissions).toEqual({ contents: 'write', packages: 'read' });
    expect(workflow.jobs['build-linux'].permissions).toEqual({ contents: 'write', 'id-token': 'write', packages: 'read' });
  });

  it('leaves every other job on the workflow permissions', () => {
    expect(workflow.jobs['build-windows'].permissions).toBeUndefined();
    expect(workflow.jobs.prepare.permissions).toBeUndefined();
    expect(workflow.jobs.release.permissions).toBeUndefined();
  });

  it('refuses a permission GitHub does not have, a level it does not take, and a CI step', () => {
    const one = (permissions, workflow = 'release', point = 'afterPackage') => () => releaseOf({ steps: { [workflow]: { [point]: [{ name: 'x', run: 'a', permissions }] } } });
    expect(one({ 'id-tokens': 'write' })).toThrow(/permissions\.id-tokens is not a GitHub permission/);
    expect(one({ contents: 'admin' })).toThrow(/permissions\.contents is "admin"; it takes none, read, write/);
    expect(one({ contents: 'write' }, 'ci', 'beforeBuild')).toThrow(/permissions are lifted onto release jobs only/);
  });
});

describe('K4 workflows.attest', { tags: ['critical'] }, () => {
  const attest = { paths: ['upload/*.apworld', 'upload/*.zip'], stage: 'afterPackage' };
  const { workflow } = releaseOf({ attest });
  const linux = workflow.jobs['build-linux'];

  it('gives the Linux job that uploads the assets id-token and attestations write on release.yml itself', () => {
    expect(linux.permissions).toEqual({ attestations: 'write', contents: 'write', 'id-token': 'write', packages: 'read' });
    expect(linux.steps.at(-1).uses).toMatch(/^actions\/upload-artifact@/);
    expect(workflow.jobs['build-windows'].permissions).toBeUndefined();
    expect(workflow.jobs['build-macos'].permissions).toBeUndefined();
  });

  it('attests the collected files with an action pinned to a full commit SHA', () => {
    const step = stepOf(linux, 'Attest the release files');
    expect(step.uses).toMatch(/^actions\/attest-build-provenance@[0-9a-f]{40}$/);
    expect(step.with['subject-path']).toBe('upload/*.apworld\nupload/*.zip');
    const names = linux.steps.map((entry) => entry.name ?? entry.uses);
    expect(names.indexOf('Collect the release files')).toBeLessThan(names.indexOf('Attest the release files'));
    expect(names.indexOf('Write the attestation bundles')).toBe(names.indexOf('Attest the release files') + 1);
    expect(names.indexOf('Write the attestation bundles')).toBeLessThan(names.length - 1);
  });

  it('attests before the package when asked', () => {
    const early = releaseOf({ attest: { paths: ['dist/*.bin'], stage: 'beforePackage' } }).workflow.jobs['build-linux'];
    const names = early.steps.map((step) => step.name);
    expect(names.indexOf('Attest the release files')).toBeLessThan(names.indexOf('Package'));
  });

  it('refuses a malformed attest and targets with no Linux build', () => {
    expect(() => releaseOf({ attest: { paths: [], stage: 'afterPackage' } })).toThrow(/paths is a list of file paths/);
    expect(() => releaseOf({ attest: { paths: ['a'], stage: 'afterRelease' } })).toThrow(/stage takes beforePackage or afterPackage/);
    expect(() => releaseOf({ attest: { paths: ['a'], stage: 'afterPackage', extra: 1 } })).toThrow(/unknown key extra/);
    expect(() => releaseOf({ attest }, ['windows'])).toThrow(/targets build no linux platform/);
  });
});
