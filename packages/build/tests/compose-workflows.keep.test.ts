/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';

const LIBUSB = { name: 'Install libusb (Linux)', run: 'sudo apt-get install -y libusb-1.0-0-dev', os: 'linux' as const };

describe('K1 composeWorkflows jobs', { tags: ['critical'] }, () => {
  it('builds one release job per chosen platform and keeps prepare and release', () => {
    const { jobs } = composeWorkflows({ targets: ['desktop', 'mobile', 'web'], prefix: 'app-' });
    expect(jobs.release).toEqual(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-android', 'build-web', 'release']);
    expect(composeWorkflows({ targets: ['windows'], prefix: 'a-' }).jobs.release).toEqual(['prepare', 'build-windows', 'release']);
  });

  it('gives PR CI the quality and review jobs, plus a web build only for web', () => {
    expect(composeWorkflows({ targets: ['desktop'], prefix: 'a-' }).jobs.ci).toEqual(['quality', 'review']);
    expect(composeWorkflows({ targets: ['android', 'web'], prefix: 'a-' }).jobs.ci).toEqual(['quality', 'review', 'web']);
  });

  it('puts a module system step before install on the matching runners only', () => {
    const { ci, release } = composeWorkflows({ targets: ['windows', 'linux'], prefix: 'a-', systemSteps: [LIBUSB] });
    expect(ci.split(LIBUSB.name).length - 1).toBe(2);
    const windowsJob = release.slice(release.indexOf('build-windows:'), release.indexOf('build-linux:'));
    expect(windowsJob).not.toContain(LIBUSB.name);
    expect(release.slice(release.indexOf('build-linux:'))).toContain(LIBUSB.name);
  });

  it('adds a changes job to the CI of an app in a workspace', () => {
    const app = { name: 'desktop', tagPrefix: 'desktop-v', notesDir: 'apps/desktop/release-notes' };
    const { jobs } = composeWorkflows({ targets: ['desktop'], appDir: 'apps/desktop', prefix: 'a-', app, baselines: true });
    expect(jobs.ci).toEqual(['changes', 'quality', 'review']);
  });
});

describe('K1 composeWorkflows release notes folder', { tags: ['critical'] }, () => {
  it('points the release at the notes folder it is given, the root one by default', () => {
    const notes = (input: object) => composeWorkflows({ targets: ['desktop'], appDir: 'apps/desktop', prefix: 'a-', ...input }).release;
    expect(notes({})).toContain('NOTES="release-notes/v$VERSION.md"');
    expect(notes({ notesDir: 'apps/desktop/release-notes' })).toContain('NOTES="apps/desktop/release-notes/v$VERSION.md"');
    expect(notes({ notesDir: 'docs/notes' })).toContain('NOTES="docs/notes/v${{ needs.prepare.outputs.version }}.md"');
  });
});

describe('K1 composeWorkflows lint and test modes', { tags: ['critical'] }, () => {
  const { ci } = composeWorkflows({ targets: ['desktop'], prefix: 'a-' });
  const stepOf = (run: string) => ci.slice(ci.lastIndexOf('- name:', ci.indexOf(`run: ${run}\n`)), ci.indexOf(`run: ${run}\n`));

  it('lints the changed files on a pull request and every file otherwise', () => {
    expect(stepOf('pnpm run lint')).toContain("if: github.event_name == 'pull_request'");
    expect(stepOf('pnpm run lint:all')).toContain("if: github.event_name != 'pull_request'");
  });

  it('runs test:pr on a pull request and test:e2e otherwise, both only when present', () => {
    expect(stepOf('pnpm run --if-present test:pr')).toContain("if: github.event_name == 'pull_request'");
    expect(stepOf('pnpm run --if-present test:e2e')).toContain("if: github.event_name != 'pull_request'");
  });
});
