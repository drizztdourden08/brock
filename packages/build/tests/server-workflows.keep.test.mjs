/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { parse } from 'yaml';
import { composeWorkflows } from '../src/release/compose-workflows.mjs';
import { renderWorkflows } from '../src/release/render-workflows.mjs';
import { removeTempRepos, tempRepo } from './temp-repo.mjs';

afterEach(removeTempRepos);

const usesOf = (text) => [...text.matchAll(/uses: (\S+)(?: # (\S+))?/g)].map((match) => ({ uses: match[1], comment: match[2] ?? null }));

const DOCKER_PINS = /^docker\/[a-z-]+@[0-9a-f]{40}$/;

const stepNames = (job) => job.steps.map((step) => step.name ?? step.uses.split('@')[0]);

describe('K1 a desktop-only app gets no server jobs', { tags: ['critical'] }, () => {
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

describe('K1 the CI and build jobs of a server-only app', { tags: ['critical'] }, () => {
  it('has the quality and server jobs in CI, and no review job', () => {
    expect(jobs.ci).toEqual(['quality', 'server']);
    expect(Object.keys(ciWorkflow.jobs)).toEqual(['quality', 'server']);
  });

  it('puts build-server before the release job and the image job after it', () => {
    expect(jobs.release).toEqual(['prepare', 'build-server', 'release', 'publish-server-image']);
    expect(Object.keys(releaseWorkflow.jobs)).toEqual(['prepare', 'build-server', 'release', 'publish-server-image']);
    expect(releaseWorkflow.jobs.release.needs).toEqual(['prepare', 'build-server']);
    expect(releaseWorkflow.jobs['build-server'].needs).toBe('prepare');
    expect(releaseWorkflow.jobs['publish-server-image'].needs).toEqual(['prepare', 'release']);
  });
});

describe('K4 the image job of a server-only app', { tags: ['critical'] }, () => {
  it('gives only the image job write access to packages', () => {
    expect(releaseWorkflow.permissions).toEqual({ contents: 'write', packages: 'read' });
    expect(releaseWorkflow.jobs['publish-server-image'].permissions).toEqual({ contents: 'read', packages: 'write' });
    expect(releaseWorkflow.jobs['build-server'].permissions).toBeUndefined();
    expect(releaseWorkflow.jobs.release.permissions).toBeUndefined();
  });

  it('pins every docker action to a full commit SHA and names the version beside it', () => {
    const docker = usesOf(release).filter(({ uses }) => uses.startsWith('docker/'));
    expect(docker.length).toBe(3);
    for (const { uses, comment } of docker) {
      expect(uses).toMatch(DOCKER_PINS);
      expect(comment).toMatch(/^v\d+\.\d+\.\d+$/);
    }
  });
});

describe('K1 a server with arm64', { tags: ['critical'] }, () => {
  const { release: armRelease } = composeWorkflows({ targets: ['server'], prefix: 'atlas-', server: { id: 'atlas', arch: ['x64', 'arm64'], image: null } });
  const workflow = parse(armRelease);

  it('runs QEMU before buildx and builds both platforms', () => {
    const job = workflow.jobs['publish-server-image'];
    const order = job.steps.map((step) => step.uses?.split('@')[0]);
    expect(order).toEqual(['actions/download-artifact', 'docker/setup-qemu-action', 'docker/setup-buildx-action', 'docker/login-action', undefined, 'docker/build-push-action']);
    expect(job.steps.at(-1).with.platforms).toBe('linux/amd64,linux/arm64');
  });
});

describe('K1 the image name', { tags: ['critical'] }, () => {
  it('takes server.image when it is on ghcr.io', () => {
    const { release: imageRelease } = composeWorkflows({ targets: ['server'], prefix: 'a-', server: { id: 'atlas', arch: ['x64'], image: 'ghcr.io/acme/atlas-engine' } });
    expect(imageRelease).toContain('IMAGE="ghcr.io/acme/atlas-engine"');
  });

  it('refuses an image on another registry, which GITHUB_TOKEN cannot push to', () => {
    expect(() => composeWorkflows({ targets: ['server'], prefix: 'a-', server: { id: 'atlas', arch: ['x64'], image: 'docker.io/acme/atlas' } })).toThrow(/not on ghcr\.io/);
  });
});

describe('K1 an app with a desktop and a server', { tags: ['critical'] }, () => {
  const both = composeWorkflows({ targets: ['desktop', 'server'], prefix: 'atlas-', server: { id: 'atlas', arch: ['x64'], image: null } });
  const bothRelease = parse(both.release);

  it('builds the desktop installers and the server, and publishes the image last', () => {
    expect(both.jobs.release).toEqual(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-server', 'release', 'publish-server-image']);
    expect(bothRelease.jobs.release.needs).toEqual(['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-server']);
  });

  it('keeps write access to packages off every desktop job', () => {
    for (const name of ['prepare', 'build-windows', 'build-macos', 'build-linux', 'build-server', 'release']) {
      expect(bothRelease.jobs[name].permissions).toBeUndefined();
    }
  });
});

describe('K1 app steps in the server jobs', { tags: ['critical'] }, () => {
  const steps = {
    ci: { beforeBuild: [{ name: 'Server only', run: 'echo s', jobs: 'server' }] },
    release: { afterPackage: [{ name: 'Sign the deb', run: 'echo sign', platforms: ['server'] }] },
  };
  const root = () => tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
  const files = (config) => Object.fromEntries(renderWorkflows(root(), config, []).map((file) => [file.path.split('/').at(-1), file.content]));
  const CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['server'], modules: [] };

  it('run in the server jobs only', () => {
    const { 'ci.yml': stepsCi, 'release.yml': stepsRelease } = files({ ...CONFIG, workflows: { steps } });
    const stepsCiWorkflow = parse(stepsCi);
    expect(stepNames(stepsCiWorkflow.jobs.server)).toContain('Server only');
    expect(stepNames(stepsCiWorkflow.jobs.quality)).not.toContain('Server only');
    expect(stepNames(parse(stepsRelease).jobs['build-server'])).toContain('Sign the deb');
  });

  it('write the same desktop workflows for a desktop app whatever its server options', () => {
    const plain = files({ product: { id: 'atlas', name: 'Atlas' }, targets: ['desktop'], modules: [] });
    const withOptions = files({ product: { id: 'atlas', name: 'Atlas' }, targets: ['desktop'], modules: [], server: { arch: ['arm64'] } });
    expect(withOptions).toEqual(plain);
  });
});

const TEST_ENV_CONFIG = { product: { id: 'atlas', name: 'Atlas' }, targets: ['windows', 'linux'], modules: [] };

const ciOf = (testEnv) => {
  const root = tempRepo({ '.git/HEAD': 'ref: refs/heads/main\n', 'brock.config.ts': '' });
  return renderWorkflows(root, { ...TEST_ENV_CONFIG, workflows: { testEnv } }, [])[0].content;
};

const stepNamesIn = (text, job) => parse(text).jobs[job].steps.map((step) => step.name);

describe('K2 workflows.testEnv of brock.config.ts', { tags: ['critical'] }, () => {
  it('keeps the ci.yml byte for byte when the app sets neither option', () => {
    const plain = composeWorkflows({ targets: ['desktop'], prefix: 'a-' }).ci;
    expect(composeWorkflows({ targets: ['desktop'], prefix: 'a-', testEnv: { linuxPackages: [], userNamespaces: false } }).ci).toBe(plain);
    expect(ciOf(undefined)).toBe(ciOf({}));
    expect(plain).not.toContain('--no-install-recommends');
  });

  it('installs the packages in the quality job only, before the build', () => {
    const text = ciOf({ linuxPackages: ['bubblewrap', 'socat'] });
    const quality = stepNamesIn(text, 'quality');
    expect(quality.indexOf('Install Linux packages')).toBeGreaterThan(quality.indexOf('Install'));
    expect(quality.indexOf('Install Linux packages')).toBeLessThan(quality.indexOf('Build'));
    expect(parse(text).jobs.quality.steps.find((step) => step.name === 'Install Linux packages').run)
      .toBe('sudo apt-get update && sudo apt-get install -y --no-install-recommends bubblewrap socat');
    expect(stepNamesIn(text, 'review')).not.toContain('Install Linux packages');
    expect(parse(text).jobs.quality['runs-on']).toBe('ubuntu-24.04');
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
    const files = renderWorkflows(root, { ...TEST_ENV_CONFIG, workflows: { ci: 'own', testEnv: { userNamespaces: true } } }, []);
    expect(files.map((file) => file.path)).toEqual(['.github/workflows/release.yml']);
  });
});
