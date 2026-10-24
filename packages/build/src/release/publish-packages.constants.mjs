/* @layer tooling-scripts @kind constants */
const PUBLISH_LABEL = 'brock.config.ts workflows.publish';

const PUBLISH_JOB = 'publish-packages';

const PUBLISH_KEYS = Object.freeze(['packages', 'registry']);

const PUBLISH_REGISTRIES = Object.freeze(['github']);

const GITHUB_REGISTRY = 'https://npm.pkg.github.com';

const GITHUB_REGISTRY_HOST = /^https:\/\/npm\.pkg\.github\.com\/?$/;

const PUBLISH_PATH = /^[\w.@-]+(\/[\w.@-]+)*$/;

const GITHUB_REMOTE = /github\.com[:/]([^/\s]+)\//i;

const ORIGIN_SECTION = /^\[remote "origin"\]$/;

const REMOTE_URL = /^\s*url\s*=\s*(\S+)\s*$/;

const REPOSITORY_SHORTHAND = /^[\w.-]+\/[\w.-]+$/;

export {
  PUBLISH_LABEL, PUBLISH_JOB, PUBLISH_KEYS, PUBLISH_REGISTRIES, GITHUB_REGISTRY, GITHUB_REGISTRY_HOST, PUBLISH_PATH, GITHUB_REMOTE, ORIGIN_SECTION, REMOTE_URL,
  REPOSITORY_SHORTHAND,
};
