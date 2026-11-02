/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const linuxJobOf = (attest) => {
  const config = { product: { id: 'atlas', name: 'Atlas' }, targets: ['desktop'], modules: [], workflows: { attest } };
  const written = renderWorkflows(tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' }), config, []);
  return parse(written.find((entry) => entry.path.endsWith('release.yml')).content).jobs['build-linux'];
};

const BASE = { paths: ['upload/*.apworld', 'upload/*.zip'], stage: 'afterPackage' };
const ATTEST = /^actions\/attest-build-provenance@[0-9a-f]{40}$/;

describe('K2 workflows.attest without perFile', { tags: ['critical'] }, () => {
  const job = linuxJobOf(BASE);

  it('attests every matched file in one step, as before', () => {
    const attests = job.steps.filter((step) => ATTEST.test(step.uses ?? ''));
    expect(attests).toHaveLength(1);
    expect(attests[0].with['subject-path']).toBe('upload/*.apworld\nupload/*.zip');
    expect(job.steps.map((step) => step.name)).not.toContain('List the release files to attest');
  });
});

describe('K2 workflows.attest with perFile', { tags: ['critical'] }, () => {
  const job = linuxJobOf({ ...BASE, perFile: true });
  const names = job.steps.map((step) => step.name);
  const slots = job.steps.filter((step) => step.name?.startsWith('Attest release file '));

  it('lists the files in a shell step, then gives each slot its own attest step on one file', () => {
    expect(names.indexOf('Collect the release files')).toBeLessThan(names.indexOf('List the release files to attest'));
    expect(names.indexOf('List the release files to attest')).toBeLessThan(names.indexOf('Attest release file 1'));
    expect(slots).toHaveLength(16);
    slots.forEach((step, at) => {
      const slot = at + 1;
      expect(step.uses).toMatch(ATTEST);
      expect(step.if).toBe(`steps.brock-attest-files.outputs.file-${slot} != ''`);
      expect(step.with).toEqual({ 'subject-path': `\${{ steps.brock-attest-files.outputs.file-${slot} }}` });
    });
    expect(names).not.toContain('Attest the release files');
  });

  it('still lifts the attest permissions onto the Linux job and refuses a perFile that is not a boolean', () => {
    expect(job.permissions).toMatchObject({ attestations: 'write', 'id-token': 'write' });
    expect(() => linuxJobOf({ ...BASE, perFile: 'yes' })).toThrow(/perFile takes true or false/);
  });
});
