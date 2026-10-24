/* @layer tooling-scripts @kind logic */
import { fillTemplate } from '../../release/fill-template.mjs';
import { SERVER_ACTIONS, SERVER_DOCKER_ARTIFACT, SERVER_JOBS, SERVER_REGISTRY } from './server-actions.constants.mjs';
import { SERVER_ARCHES, SERVER_DIR } from './server.constants.mjs';

/**
 * @typedef {import('../platform.type.mjs').JobContext} JobContext
 * @typedef {import('../platform.type.mjs').Job} Job
 */

const pinned = ({ name, sha, version }) => `${name}@${sha} # ${version}`;

const imageOf = ({ id, image }) => {
  if (image === null) return `${SERVER_REGISTRY}/\${GITHUB_REPOSITORY_OWNER,,}/${id}-server`;
  if (!image.startsWith(`${SERVER_REGISTRY}/`)) {
    throw new Error(`brock.config.ts server.image "${image}" is not on ${SERVER_REGISTRY}: the managed release workflow pushes the image there with GITHUB_TOKEN. Name an image under ${SERVER_REGISTRY}/, or leave server.image out.`);
  }
  return image;
};

const downloadsOf = ({ prefix, server }) => server.arch.flatMap((arch) => [
  { glob: `artifacts/release-server/${prefix}server-linux-${arch}.tar.gz`, label: `Server for Linux ${arch} (.tar.gz), with its own Node` },
  { glob: `artifacts/release-server/${prefix}server_*_${SERVER_ARCHES[arch].deb}.deb`, label: `Server for Debian and Ubuntu ${arch} (.deb), runs as a systemd service` },
]);

const qemuStep = (server) => (server.arch.includes('arm64') ? `\n\n      - uses: ${pinned(SERVER_ACTIONS.qemu)}` : '');

/**
 * @type {{ ci: (ctx: JobContext) => Job, release: (ctx: JobContext) => Job, image: (ctx: JobContext) => Job }}
 */
const serverJobs = {
  ci: (ctx) => ({
    id: SERVER_JOBS.ci,
    text: fillTemplate(SERVER_DIR, 'server-ci-job.yml.tmpl', {
      SETUP: ctx.setup('linux', { platform: 'server', job: SERVER_JOBS.ci }),
      BEFORE_BUILD: ctx.stepsAt('beforeBuild', 'linux', 'server', SERVER_JOBS.ci),
      AFTER_BUILD: ctx.stepsAt('afterBuild', 'linux', 'server', SERVER_JOBS.ci),
    }),
  }),
  release: (ctx) => ({
    id: SERVER_JOBS.release,
    downloads: downloadsOf(ctx),
    text: fillTemplate(SERVER_DIR, 'server-release-job.yml.tmpl', {
      SETUP: ctx.setup('linux', { release: true, platform: 'server', job: SERVER_JOBS.release }),
      BEFORE_PACKAGE: ctx.stepsAt('beforePackage', 'linux', 'server', SERVER_JOBS.release),
      AFTER_PACKAGE: ctx.stepsAt('afterPackage', 'linux', 'server', SERVER_JOBS.release),
      ARCH: ctx.server.arch.join(','),
      DOCKER_ARTIFACT: SERVER_DOCKER_ARTIFACT,
    }),
  }),
  image: (ctx) => ({
    id: SERVER_JOBS.image,
    text: fillTemplate(SERVER_DIR, 'server-image-job.yml.tmpl', {
      DOCKER_ARTIFACT: SERVER_DOCKER_ARTIFACT,
      QEMU: qemuStep(ctx.server),
      BUILDX: pinned(SERVER_ACTIONS.buildx),
      LOGIN: pinned(SERVER_ACTIONS.login),
      BUILD: pinned(SERVER_ACTIONS.build),
      REGISTRY: SERVER_REGISTRY,
      IMAGE: imageOf(ctx.server),
      PLATFORMS: ctx.server.arch.map((arch) => `linux/${SERVER_ARCHES[arch].docker}`).join(','),
    }),
  }),
};

export { serverJobs };
