/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';

const LIBUSB = { name: 'Install libusb (Linux)', run: 'sudo apt-get install -y libusb-1.0-0-dev', os: 'linux' as const };

describe('composeWorkflows', () => {
  it('builds one release job per chosen platform and keeps prepare and release', () => {
    const { jobs, release } = composeWorkflows({ targets: ['desktop', 'mobile', 'web'], prefix: 'app-' });
    expect(jobs.release).toEqual(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-android', 'build-web', 'release']);
    expect(release).toContain('needs: [prepare, build-windows, build-macos, build-linux, build-android, build-web]');
    expect(release).toContain('upload/app-android.apk');
    expect(release).toContain('upload/app-web.zip');
    expect(release).toContain('stub "artifacts/release-windows/*-windows-setup.exe"');
    expect(release).not.toMatch(/__[A-Z_]+__/);
  });

  it('gives PR CI the quality and review jobs, plus a web build only for web', () => {
    expect(composeWorkflows({ targets: ['desktop'], prefix: 'a-' }).jobs.ci).toEqual(['quality', 'review']);
    const { ci, jobs } = composeWorkflows({ targets: ['android', 'web'], prefix: 'a-' });
    expect(jobs.ci).toEqual(['quality', 'review', 'web']);
    expect(ci).toContain('xvfb-run -a pnpm --dir "$APP_DIR" exec brock launch main none --prod --review');
    expect(ci).toContain('pull_request:');
  });

  it('drops the jobs of platforms that are not chosen', () => {
    const { release, jobs } = composeWorkflows({ targets: ['windows'], prefix: 'a-' });
    expect(jobs.release).toEqual(['prepare', 'build-windows', 'release']);
    expect(release).not.toContain('release-macos');
    expect(release).not.toContain('setup-java');
  });

  it('puts a module system step before install on the matching runners only', () => {
    const { ci, release } = composeWorkflows({ targets: ['windows', 'linux'], prefix: 'a-', systemSteps: [LIBUSB] });
    expect(ci.split(LIBUSB.name).length - 1).toBe(2);
    const windowsJob = release.slice(release.indexOf('build-windows:'), release.indexOf('build-linux:'));
    expect(windowsJob).not.toContain(LIBUSB.name);
    expect(release.slice(release.indexOf('build-linux:'))).toContain(LIBUSB.name);
  });

  it('builds the commit prepare checked, at the release version, in every build job', () => {
    const { release } = composeWorkflows({ targets: ['desktop'], prefix: 'a-' });
    expect(release.split('ref: ${{ needs.prepare.outputs.sha }}').length - 1).toBe(4);
    expect(release.split('- name: Set the release version').length - 1).toBe(3);
  });

  it('runs every action on its Node 24 major and lets packageManager pick pnpm', () => {
    const { ci, release } = composeWorkflows({ targets: ['desktop', 'android', 'web'], prefix: 'a-' });
    const used = new Set([...`${ci}${release}`.matchAll(/uses: ([\w./-]+@v\d+)/g)].map((m) => m[1]));
    expect([...used].sort()).toEqual([
      'actions/checkout@v7', 'actions/download-artifact@v8', 'actions/setup-dotnet@v6', 'actions/setup-java@v6', 'actions/setup-node@v7',
      'actions/upload-artifact@v7', 'android-actions/setup-android@v4', 'pnpm/action-setup@v6', 'softprops/action-gh-release@v3',
    ]);
    expect(`${ci}${release}`).not.toMatch(/pnpm\/action-setup@v6\n\s+with:/);
  });

  it('runs CI on a push to the default branch too, and cancels only pull request runs', () => {
    const { ci } = composeWorkflows({ targets: ['desktop'], prefix: 'a-', branch: 'trunk' });
    expect(ci).toContain('on:\n  pull_request:\n  push:\n    branches: [trunk]\n  workflow_dispatch:');
    expect(ci).toContain("cancel-in-progress: ${{ github.event_name == 'pull_request' }}");
    expect(composeWorkflows({ targets: ['desktop'], prefix: 'a-' }).ci).toContain('branches: [main]');
  });

  it('pins the review job to ubuntu-24.04 with or without baselines', () => {
    for (const baselines of [false, true]) {
      const { ci } = composeWorkflows({ targets: ['desktop'], prefix: 'a-', baselines });
      expect(ci).toContain('  review:\n    runs-on: ubuntu-24.04\n');
    }
  });
});

describe('composeWorkflows with screenshot baselines', () => {
  it('compares the review with the linux baselines when the app turns them on, with a bless input', () => {
    const plain = composeWorkflows({ targets: ['desktop'], prefix: 'a-' }).ci;
    expect(plain).toContain('  workflow_dispatch:\n\nconcurrency:');
    expect(plain).not.toContain('review-baselines');
    const { ci } = composeWorkflows({ targets: ['desktop'], prefix: 'a-', baselines: true });
    expect(ci).toContain('xvfb-run -a -s "-screen 0 1920x1080x24" pnpm --dir "$APP_DIR" exec brock launch main none --prod --review ${{ inputs.bless && \'--review-bless\' || \'--review-baselines\' }}');
    expect(ci).toContain('  workflow_dispatch:\n    inputs:\n      bless:');
    expect(ci).toContain('runs-on: ubuntu-24.04');
    expect(ci).toContain('if: always() && inputs.bless');
    expect(ci).toContain('path: ${{ env.APP_DIR }}/tests/baselines/linux/');
    expect(ci).toContain('path: .user-data-review/Data/review/');
    expect(ci).toContain('name: review-baselines\n');
    expect(plain).toContain('path: .user-data/Data/review/');
    expect(plain).not.toContain('${{ env.APP_DIR }}/.user-data');
    expect(ci).not.toMatch(/__[A-Z_]+__/);
  });

  it('gives each app of a workspace its own baselines job, bless input and artifact', () => {
    const app = { name: 'desktop', tagPrefix: 'desktop-v', notesDir: 'apps/desktop/release-notes' };
    const { ci, jobs } = composeWorkflows({ targets: ['desktop'], appDir: 'apps/desktop', prefix: 'a-', app, baselines: true });
    expect(jobs.ci).toEqual(['changes', 'quality', 'review']);
    expect(ci).toContain('  workflow_dispatch:\n    inputs:\n      bless:');
    expect(ci).toContain('brock affected');
    expect(ci).toContain('brock release-notes check');
    expect(ci).toContain("  review:\n    needs: changes\n    if: needs.changes.outputs.changed == 'true'\n    runs-on: ubuntu-24.04");
    expect(ci).toContain('name: review-baselines-desktop\n          path: ${{ env.APP_DIR }}/tests/baselines/linux/');
    expect(ci).toContain('APP_DIR: apps/desktop');
    expect(ci).toContain('name: review-desktop\n          path: .user-data-review/Data/review/');
    expect(ci).not.toMatch(/__[A-Z_]+__/);
  });

  it('uploads the review report from the repo root, where launch writes its data, for an app in a folder', () => {
    const app = { name: 'desktop', tagPrefix: 'desktop-v', notesDir: 'apps/desktop/release-notes' };
    const many = composeWorkflows({ targets: ['desktop'], appDir: 'apps/desktop', prefix: 'a-', app }).ci;
    expect(many).toContain('name: review-desktop\n          path: .user-data/Data/review/');
    const one = composeWorkflows({ targets: ['desktop'], appDir: 'apps/desktop', prefix: 'a-' }).ci;
    expect(one).toContain('name: review\n          path: .user-data/Data/review/');
  });
});
