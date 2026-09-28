/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { basename } from 'node:path';

const TEMPLATE_IDENTITY = {
  id: 'brock-template-app',
  name: 'Brock App',
  appId: 'com.drizztdourden08.brock-template-app',
  description: 'A blank Brock app.',
  authorName: 'drizztdourden_',
  authorEmail: 'drizztdourden08@users.noreply.github.com',
};

const SLUG = /^[a-z][a-z0-9-]{0,30}$/;
const REVERSE_DNS = /^[a-z0-9]+(\.[a-z0-9-]+)+$/i;

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 31) || 'my-app';

const titleCase = (slug) =>
  slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');

const gitConfig = (key) => {
  try {
    return execFileSync('git', ['config', key], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || null;
  } catch {
    return null;
  }
};

/**
 * @typedef {object} Identity
 * @property {string} id
 * @property {string} name
 * @property {string} appId
 * @property {string} authorName
 * @property {string} authorEmail
 */

/**
 * @param {string} targetDir
 * @returns {Identity}
 */
const defaultIdentity = (targetDir) => {
  const id = slugify(basename(targetDir));
  return {
    id,
    name: titleCase(id),
    appId: `com.example.${id}`,
    authorName: gitConfig('user.name') ?? '',
    authorEmail: gitConfig('user.email') ?? '',
  };
};

/**
 * @param {Identity} identity
 */
const identityProblem = (identity) => {
  if (!SLUG.test(identity.id)) return `id "${identity.id}" must be a slug like "my-app": a letter first, at most 31 characters (it also names the repo command)`;
  if (!identity.name.trim()) return 'name is required';
  if (!REVERSE_DNS.test(identity.appId)) return `app id "${identity.appId}" must be reverse-DNS like "com.example.my-app"`;
  if (!identity.authorName.trim()) return 'author name is required';
  return null;
};

export { TEMPLATE_IDENTITY, defaultIdentity, identityProblem };
