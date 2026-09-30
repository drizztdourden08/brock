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

  it('checks out the release tag in every build job', () => {
    const { release } = composeWorkflows({ targets: ['desktop'], prefix: 'a-' });
    expect(release.split('ref: ${{ needs.prepare.outputs.tag }}').length - 1).toBe(4);
  });
});
