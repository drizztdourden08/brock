/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { workspaceDirs } from '../workspace-dirs.mjs';
import { fillTemplate } from './fill-template.mjs';
import {
  GITHUB_REGISTRY, GITHUB_REGISTRY_HOST, PUBLISH_JOB, PUBLISH_KEYS, PUBLISH_LABEL, PUBLISH_PATH, PUBLISH_REGISTRIES,
} from './publish-packages.constants.mjs';
import { repoOwnerOf } from './repo-owner.mjs';
import { RELEASE_DIR } from './workflows.constants.mjs';

/**
 * @typedef {import('@drizztdourden08/brock-core/module').WorkflowPublish} WorkflowPublish
 * @typedef {{ name: string, dir: string, build: boolean }} PublishPackage
 * @typedef {{ owner: string, packages: PublishPackage[] }} PublishPlan
 */

const fail = (message) => {
  throw new Error(`${PUBLISH_LABEL}: ${message}`);
};

const slashed = (path) => path.replace(/\\/g, '/');

const assertShape = (publish) => {
  if (typeof publish !== 'object' || publish === null || Array.isArray(publish)) fail("takes { packages: string[], registry?: 'github' }.");
  const unknown = Object.keys(publish).filter((key) => !PUBLISH_KEYS.includes(key));
  if (unknown.length) fail(`unknown key ${unknown.join(', ')}; it takes ${PUBLISH_KEYS.join(' and ')}.`);
  if (publish.registry !== undefined && !PUBLISH_REGISTRIES.includes(publish.registry)) {
    fail(`registry takes ${PUBLISH_REGISTRIES.map((name) => `'${name}'`).join(' or ')}; got ${JSON.stringify(publish.registry)}.`);
  }
  const { packages } = publish;
  if (!Array.isArray(packages) || !packages.length || packages.some((path) => typeof path !== 'string')) {
    fail('packages is a list of workspace package folders, such as packages/client-kit.');
  }
};

const folderOf = (path) => {
  const folder = slashed(path.trim()).replace(/^\.\//, '').replace(/\/+$/, '');
  if (!PUBLISH_PATH.test(folder) || folder.split('/').includes('..')) {
    fail(`${JSON.stringify(path)} is not a folder inside the repo; list a workspace package folder such as packages/client-kit.`);
  }
  return folder;
};

const manifestOf = (repoDir, folder, workspace) => {
  const file = join(repoDir, folder, 'package.json');
  if (!workspace.has(folder) || !existsSync(file)) {
    fail(`${folder} is not a workspace package. List a folder that pnpm-workspace.yaml covers and that holds a package.json.`);
  }
  return JSON.parse(readFileSync(file, 'utf8'));
};

const assertPublishable = (manifest, folder, owner) => {
  const name = manifest.name ?? folder;
  if (manifest.private === true) {
    fail(`${name} (${folder}) is private: true, and a private package is never published. Remove private from ${folder}/package.json, or take the folder off packages.`);
  }
  if (typeof manifest.name !== 'string' || typeof manifest.version !== 'string') fail(`${folder}/package.json needs a name and a version to publish.`);
  if (!manifest.name.startsWith(`@${owner}/`)) {
    const scope = manifest.name.startsWith('@') ? manifest.name.split('/')[0] : 'no scope';
    fail(`${name} has ${scope}, and GitHub Packages only takes the repo owner's scope @${owner}. Rename it to @${owner}/${manifest.name.split('/').pop()} in ${folder}/package.json, or take the folder off packages.`);
  }
  if (!GITHUB_REGISTRY_HOST.test(manifest.publishConfig?.registry ?? '')) {
    fail(`${name} has no publishConfig.registry set to ${GITHUB_REGISTRY}. Add "publishConfig": { "registry": "${GITHUB_REGISTRY}" } to ${folder}/package.json.`);
  }
};

/**
 * @param {WorkflowPublish | undefined} publish workflows.publish of brock.config.ts
 * @param {string} repoDir the repo root
 * @returns {PublishPlan | null} the checked packages, null for none
 */
const publishPlan = (publish, repoDir) => {
  if (publish === undefined || publish === null) return null;
  assertShape(publish);
  const owner = repoOwnerOf(repoDir);
  if (!owner) fail('cannot tell the repo owner. Add an origin remote on github.com, or set repository in the root package.json.');
  const workspace = new Set(workspaceDirs(repoDir).map((dir) => slashed(relative(resolve(repoDir), dir))));
  const folders = publish.packages.map(folderOf);
  const repeated = folders.find((folder, at) => folders.indexOf(folder) !== at);
  if (repeated) fail(`${repeated} is listed twice.`);
  const packages = folders.map((folder) => {
    const manifest = manifestOf(repoDir, folder, workspace);
    assertPublishable(manifest, folder, owner);
    return { name: manifest.name, dir: folder, build: typeof manifest.scripts?.build === 'string' };
  });
  return { owner, packages };
};

const RELEASE_REF = '\n        with:\n          ref: ${{ needs.prepare.outputs.sha }}';

const stepsOf = (plan, selected) => {
  const each = (name, values) => fillTemplate(RELEASE_DIR, name, { REGISTRY: GITHUB_REGISTRY, ...values }).trimEnd();
  const dirs = plan.packages.map((pkg) => pkg.dir);
  const condition = (pkg) => (selected ? `        if: contains(steps.select.outputs.folders, ',${pkg.dir},')\n` : '');
  const builds = plan.packages.filter((pkg) => pkg.build).map((pkg) => each('publish-build-step.yml.tmpl', { NAME: pkg.name, DIR: pkg.dir, CONDITION: condition(pkg) }));
  const publishes = plan.packages.map((pkg) => each('publish-package-step.yml.tmpl', { NAME: pkg.name, DIR: pkg.dir, CONDITION: condition(pkg) }));
  const select = selected ? [each('publish-select-step.yml.tmpl', { ALLOWED: `,${dirs.join(',')},`, LISTED: dirs.join(', ') })] : [];
  return [...select, ...builds, ...publishes].join('\n');
};

const jobText = (plan, { needs, ref, selected }) => fillTemplate(RELEASE_DIR, 'publish-job.yml.tmpl', {
  JOB: PUBLISH_JOB,
  NEEDS: needs,
  REF: ref,
  REGISTRY: GITHUB_REGISTRY,
  OWNER: plan.owner,
  STEPS: `\n${stepsOf(plan, selected)}`,
}).trimEnd();

/**
 * @param {PublishPlan | null} plan
 * @param {string} needs the YAML list of jobs the publish job waits for
 * @returns {string} the job and a blank line, or nothing
 */
const publishJobText = (plan, needs) => (plan ? `${jobText(plan, { needs: `    needs: ${needs}\n`, ref: RELEASE_REF, selected: false })}\n\n` : '');

/**
 * @param {PublishPlan | null} plan
 * @param {{ name: string } | null} app the app of a repo of several apps, null for one
 * @returns {string | null} the standalone publish-packages workflow, null for none
 */
const publishWorkflowText = (plan, app) => {
  if (!plan) return null;
  return `${fillTemplate(RELEASE_DIR, 'publish-packages-workflow.yml.tmpl', {
    TITLE: app ? ` ${app.name}` : '',
    GROUP: app ? `-${app.name}` : '',
    FOLDERS: plan.packages.map((pkg) => pkg.dir).join(', '),
    JOB: jobText(plan, { needs: '', ref: '', selected: true }),
  }).trimEnd()}\n`;
};

export { publishPlan, publishJobText, publishWorkflowText };
