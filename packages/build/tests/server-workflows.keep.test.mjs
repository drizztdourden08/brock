/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const FIXTURES = join(import.meta.dirname, 'fixtures', 'workflows');

const fixture = (name) => readFileSync(join(FIXTURES, name), 'utf8').replace(/\r\n/g, '\n');

const usesOf = (text) => [...text.matchAll(/uses: (\S+)(?: # (\S+))?/g)].map((match) => ({ uses: match[1], comment: match[2] ?? null }));

const DOCKER_PINS = /^docker\/[a-z-]+@[0-9a-f]{40}$/;

const stepNames = (job) => job.steps.map((step) => step.name ?? step.uses.split('@')[0]);

const ONE_OF_MANY = { name: 'tool', tagPrefix: 'tool-v', notesDir: 'apps/tool/release-notes' };

describe('a desktop-only app keeps its workflows byte for byte', () => {
  const cases = [
    ['desktop', { targets: ['desktop'], prefix: 'app-' }],
    ['desktop-mobile-web', { targets: ['desktop', 'mobile', 'web'], prefix: 'app-', baselines: true }],
    ['one-of-many', { targets: ['desktop'], prefix: 'tool-', appDir: 'apps/tool', app: ONE_OF_MANY }],
  ];

  it.each(cases)('%s writes the ci.yml and release.yml it wrote before the server kind', (name, input) => {
    const { ci, release } = composeWorkflows(input);
    expect(ci).toBe(fixture(`${name}.ci.yml`));
    expect(release).toBe(fixture(`${name}.release.yml`));
  });

  it('adds no server job, no image job and no docker action', () => {
    const { ci, release, jobs } = composeWorkflows({ targets: ['desktop', 'web'], prefix: 'app-' });
    expect(jobs.ci).toEqual(['quality', 'review', 'web']);
    expect(jobs.release).toEqual(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-web', 'release']);
    expect(`${ci}${release}`).not.toMatch(/build-server|publish-server|server-docker|docker|ghcr/i);
  });
});

const { ci, release, jobs } = composeWorkflows({ targets: ['server'], prefix: 'atlas-', server: { id: 'atlas', arch: ['x64'], image: null } });
const ciWorkflow = parse(ci);
const releaseWorkflow = parse(release);

describe('the CI and build jobs of a server-only app', () => {
  it('has the quality and server jobs in CI, and no review job', () => {
    expect(jobs.ci).toEqual(['quality', 'server']);
    expect(Object.keys(ciWorkflow.jobs)).toEqual(['quality', 'server']);
    expect(ci).not.toContain('xvfb');
    expect(ci).not.toContain('--review');
  });

  it('builds the server, starts it on a temporary folder and waits for its health check', () => {
    const steps = ciWorkflow.jobs.server.steps;
    expect(steps.map((step) => step.name)).toContain('Build the server');
    expect(steps.find((step) => step.name === 'Build the server').run).toBe('pnpm --dir "$APP_DIR" exec brock server build');
    const smoke = steps.find((step) => step.name === 'Start the server and wait for its health check').run;
    expect(smoke).toContain('DATA="$(mktemp -d)"');
    expect(smoke).toContain('node "$BUNDLE" --user-data="$DATA" &');
    expect(smoke).toContain('node "$BUNDLE" health --user-data="$DATA"');
    expect(smoke).toContain('seq 1 30');
    expect(smoke).toContain('kill "$PID"');
    expect(smoke).toContain('test -n "$HEALTHY"');
  });

  it('puts build-server before the release job and the image job after it', () => {
    expect(jobs.release).toEqual(['prepare', 'build-server', 'release', 'publish-server-image']);
    expect(Object.keys(releaseWorkflow.jobs)).toEqual(['prepare', 'build-server', 'release', 'publish-server-image']);
    expect(releaseWorkflow.jobs.release.needs).toEqual(['prepare', 'build-server']);
    expect(releaseWorkflow.jobs['build-server'].needs).toBe('prepare');
    expect(releaseWorkflow.jobs['publish-server-image'].needs).toEqual(['prepare', 'release']);
  });

  it('packages every architecture with a deb and uploads the release files and the docker context', () => {
    const job = releaseWorkflow.jobs['build-server'];
    expect(job['runs-on']).toBe('ubuntu-24.04');
    expect(job.steps.find((step) => step.name === 'Package the server').run).toBe('pnpm --dir "$APP_DIR" exec brock server package --arch x64 --deb');
    expect(job.steps.find((step) => step.name === 'Collect the release files').run).toContain('cp "$APP_DIR"/release/server/*.tar.gz "$APP_DIR"/release/server/*.deb upload/');
    const uploads = job.steps.filter((step) => step.uses === 'actions/upload-artifact@v7');
    expect(uploads.map((step) => step.with.name)).toEqual(['release-server', 'server-docker']);
    expect(uploads[0].with.path).toBe('upload/*');
    expect(uploads[1].with.path).toBe('${{ env.APP_DIR }}/release/server/docker');
  });

  it('sets the release version before it builds, like every other build job', () => {
    const names = stepNames(releaseWorkflow.jobs['build-server']);
    expect(names).toContain('Set the release version');
    expect(names.indexOf('Set the release version')).toBeLessThan(names.indexOf('Package the server'));
  });

});

describe('the release body and the image job of a server-only app', () => {
  it('links the tarball and the deb in the release body', () => {
    expect(release).toContain('link "artifacts/release-server/atlas-server-linux-x64.tar.gz" "Server for Linux x64 (.tar.gz), with its own Node"');
    expect(release).toContain('link "artifacts/release-server/atlas-server_*_amd64.deb" "Server for Debian and Ubuntu x64 (.deb), runs as a systemd service"');
  });

  it('gives only the image job write access to packages', () => {
    expect(releaseWorkflow.permissions).toEqual({ contents: 'write', packages: 'read' });
    expect(releaseWorkflow.jobs['publish-server-image'].permissions).toEqual({ contents: 'read', packages: 'write' });
    expect(releaseWorkflow.jobs['build-server'].permissions).toBeUndefined();
    expect(releaseWorkflow.jobs.release.permissions).toBeUndefined();
  });

  it('builds a single platform without QEMU, to ghcr.io under the repo owner, and tags the version', () => {
    const job = releaseWorkflow.jobs['publish-server-image'];
    expect(job.steps.map((step) => step.uses?.split('@')[0])).toEqual([
      'actions/download-artifact', 'docker/setup-buildx-action', 'docker/login-action', undefined, 'docker/build-push-action',
    ]);
    expect(release).not.toContain('docker/setup-qemu-action');
    const build = job.steps.at(-1);
    expect(build.with).toEqual({ context: 'docker', platforms: 'linux/amd64', push: true, tags: '${{ steps.tags.outputs.tags }}' });
    const tags = job.steps.find((step) => step.id === 'tags');
    expect(tags.run).toContain('IMAGE="ghcr.io/${GITHUB_REPOSITORY_OWNER,,}/atlas-server"');
    expect(tags.run).toContain('TAGS="$IMAGE:$VERSION"');
    expect(tags.env).toEqual({ VERSION: '${{ needs.prepare.outputs.version }}', SET_LATEST: '${{ inputs.set_latest }}' });
    const login = job.steps.find((step) => step.uses?.startsWith('docker/login-action'));
    expect(login.with).toEqual({ registry: 'ghcr.io', username: '${{ github.actor }}', password: '${{ secrets.GITHUB_TOKEN }}' });
  });

  it('adds latest only when the release is set as the latest', () => {
    const tags = releaseWorkflow.jobs['publish-server-image'].steps.find((step) => step.id === 'tags').run;
    expect(tags).toContain('if [ "$SET_LATEST" = "true" ]; then TAGS="$TAGS,$IMAGE:latest"; fi');
    expect(tags.split('latest').length - 1).toBe(1);
  });

  it('pins every docker action to a full commit SHA and names the version beside it', () => {
    const docker = usesOf(release).filter(({ uses }) => uses.startsWith('docker/'));
    expect(docker.length).toBe(3);
    for (const { uses, comment } of docker) {
      expect(uses).toMatch(DOCKER_PINS);
      expect(comment).toMatch(/^v\d+\.\d+\.\d+$/);
    }
  });

  it('leaves no placeholder behind', () => {
    expect(`${ci}${release}`).not.toMatch(/__[A-Z_]+__/);
  });
});

describe('a server with arm64', () => {
  const { release } = composeWorkflows({ targets: ['server'], prefix: 'atlas-', server: { id: 'atlas', arch: ['x64', 'arm64'], image: null } });
  const workflow = parse(release);

  it('packages both architectures in one run', () => {
    expect(workflow.jobs['build-server'].steps.find((step) => step.name === 'Package the server').run).toContain('--arch x64,arm64 --deb');
    expect(release).toContain('atlas-server-linux-arm64.tar.gz');
    expect(release).toContain('atlas-server_*_arm64.deb');
  });

  it('runs QEMU before buildx and builds both platforms', () => {
    const job = workflow.jobs['publish-server-image'];
    const order = job.steps.map((step) => step.uses?.split('@')[0]);
    expect(order).toEqual(['actions/download-artifact', 'docker/setup-qemu-action', 'docker/setup-buildx-action', 'docker/login-action', undefined, 'docker/build-push-action']);
    expect(job.steps.at(-1).with.platforms).toBe('linux/amd64,linux/arm64');
  });
});

describe('the image name', () => {
  it('takes server.image when it is on ghcr.io', () => {
    const { release } = composeWorkflows({ targets: ['server'], prefix: 'a-', server: { id: 'atlas', arch: ['x64'], image: 'ghcr.io/acme/atlas-engine' } });
    expect(release).toContain('IMAGE="ghcr.io/acme/atlas-engine"');
  });

  it('refuses an image on another registry, which GITHUB_TOKEN cannot push to', () => {
    expect(() => composeWorkflows({ targets: ['server'], prefix: 'a-', server: { id: 'atlas', arch: ['x64'], image: 'docker.io/acme/atlas' } })).toThrow(/not on ghcr\.io/);
  });
});

describe('an app with a desktop and a server', () => {
  const { ci, release, jobs } = composeWorkflows({ targets: ['desktop', 'server'], prefix: 'atlas-', server: { id: 'atlas', arch: ['x64'], image: null } });
  const ciWorkflow = parse(ci);
  const releaseWorkflow = parse(release);

  it('keeps the review job and adds the server job after it', () => {
    expect(jobs.ci).toEqual(['quality', 'review', 'server']);
    expect(Object.keys(ciWorkflow.jobs)).toEqual(['quality', 'review', 'server']);
  });

  it('builds the desktop installers and the server, and publishes the image last', () => {
    expect(jobs.release).toEqual(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-server', 'release', 'publish-server-image']);
    expect(releaseWorkflow.jobs.release.needs).toEqual(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-server']);
  });

  it('links the desktop and server downloads together', () => {
    expect(release).toContain('stub "artifacts/release-windows/*-windows-setup.exe"');
    expect(release).toContain('link "artifacts/release-server/atlas-server-linux-x64.tar.gz"');
  });

  it('keeps write access to packages off every desktop job', () => {
    for (const name of ['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-server', 'release']) {
      expect(releaseWorkflow.jobs[name].permissions).toBeUndefined();
    }
  });
});

describe('app steps in the server jobs', () => {
  const steps = {
    ci: { beforeBuild: [{ name: 'Server only', run: 'echo s', jobs: 'server' }] },
    release: { afterPackage: [{ name: 'Sign the deb', run: 'echo sign', platforms: ['server'] }] },
  };
  const root = () => tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
  const files = (config) => Object.fromEntries(renderWorkflows(root(), config, []).map((file) => [file.path.split('/').at(-1), file.content]));
  const CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['server'], modules: [] };

  it('run in the server jobs only', () => {
    const { 'ci.yml': ci, 'release.yml': release } = files({ ...CONFIG, workflows: { steps } });
    const ciWorkflow = parse(ci);
    expect(stepNames(ciWorkflow.jobs.server)).toContain('Server only');
    expect(stepNames(ciWorkflow.jobs.quality)).not.toContain('Server only');
    expect(stepNames(parse(release).jobs['build-server'])).toContain('Sign the deb');
  });

  it('read server.arch and server.image from brock.config.ts', () => {
    const { 'release.yml': release } = files({ ...CONFIG, server: { arch: ['x64', 'arm64'], image: 'ghcr.io/acme/atlas-server' } });
    expect(release).toContain('brock server package --arch x64,arm64 --deb');
    expect(release).toContain('IMAGE="ghcr.io/acme/atlas-server"');
    expect(release).toContain('platforms: linux/amd64,linux/arm64');
  });

  it('default to x64 and the image under the repo owner', () => {
    const { 'release.yml': release } = files(CONFIG);
    expect(release).toContain('brock server package --arch x64 --deb');
    expect(release).toContain('IMAGE="ghcr.io/${GITHUB_REPOSITORY_OWNER,,}/atlas-server"');
  });

  it('write the same desktop workflows for a desktop app whatever its server options', () => {
    const plain = files({ product: { id: 'atlas', name: 'Atlas' }, targets: ['desktop'], modules: [] });
    const withOptions = files({ product: { id: 'atlas', name: 'Atlas' }, targets: ['desktop'], modules: [], server: { arch: ['arm64'] } });
    expect(withOptions).toEqual(plain);
  });
});
