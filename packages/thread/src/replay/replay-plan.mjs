/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { attempt } from './replay-exec.mjs';
import { pendingPrs, pendingReleases, registryOf } from './replay-sources.mjs';

const REMOTE = 'origin';

const short = (sha) => String(sha).slice(0, 9);

const tagOf = (release) => release.tag ?? `v${release.version}`;

const gitTry = (exec, args, cwd) => attempt(exec, 'git', args, cwd);

const baseState = ({ exec, cwd, integration, remoteBase }) => {
  const local = gitTry(exec, ['rev-parse', '--verify', '--quiet', `${integration}^{commit}`], cwd);
  const known = gitTry(exec, ['rev-parse', '--verify', '--quiet', `${REMOTE}/${remoteBase}^{commit}`], cwd);
  if (!local) return { blocked: `There is no local branch ${integration}.` };
  if (!known) return { blocked: `${REMOTE}/${remoteBase} is not known here. Fetch it first, then plan again.` };
  if (local === known) return { upToDate: `${REMOTE}/${remoteBase} already holds ${short(local)}.` };
  if (gitTry(exec, ['merge-base', '--is-ancestor', known, local], cwd) === null) {
    return { blocked: `${integration} (${short(local)}) is not a fast-forward of ${REMOTE}/${remoteBase} (${short(known)}) as last fetched.` };
  }
  return {};
};

const baseItem = (request) => {
  const { integration, remoteBase } = request;
  return {
    kind: 'push-base',
    id: integration,
    title: `Push ${integration} to ${REMOTE}/${remoteBase}`,
    commands: [`git push ${REMOTE} ${integration}:refs/heads/${remoteBase}`],
    integration,
    remoteBase,
    ...baseState(request),
  };
};

const prItem = (pr, remoteBase) => {
  const sha = pr.mergeCommit ?? pr.headCommit ?? pr.head;
  const phrase = `merged locally as ${pr.id} at ${sha}`;
  const title = `${pr.title} (merged locally as ${pr.id} at ${short(sha)})`;
  const ref = pr.headCommit ?? pr.head;
  return {
    kind: 'pr',
    id: pr.id,
    title: `Open a GitHub PR for ${pr.id}: ${pr.title}`,
    commands: [`git push ${REMOTE} ${ref}:refs/heads/${pr.head}`, `gh pr create --head ${pr.head} --base ${remoteBase} --title "${title}" --body "${phrase}"`],
    head: pr.head,
    ref,
    prTitle: title,
    prBody: phrase,
    remoteBase,
  };
};

const releaseItem = (release, cwd) => {
  const packages = release.packages.map((pkg) => ({ ...pkg, registry: registryOf(cwd, pkg.name), file: join(release.dir, pkg.tarball) }));
  const assets = (release.assets ?? []).map((asset) => join(release.dir, asset.path ?? asset.name));
  const notes = join(release.dir, release.notes ?? 'notes.md');
  const count = packages.length;
  return {
    kind: 'release',
    id: `${release.project}/${release.channel}/${release.version}`,
    title: `Publish ${tagOf(release)} (${count} package${count === 1 ? '' : 's'}) and create the GitHub release`,
    commands: [
      ...packages.map((pkg) => `npm publish ${pkg.file} --registry ${pkg.registry}`),
      `gh release create ${tagOf(release)} --notes-file ${notes}${assets.map((asset) => ` ${asset}`).join('')}`,
    ],
    release,
    packages,
    assets,
    notes,
  };
};

/**
 * @param {{ cwd: string, project: string, integration: string, remoteBase: string, exec: Function }} request
 * @returns {object[]} the ordered actions: base push, merged PRs, releases
 */
const buildPlan = (request) => {
  const prs = pendingPrs(request).map((pr) => prItem(pr, request.remoteBase));
  const releases = pendingReleases(request.project).map((release) => releaseItem(release, request.cwd));
  return [baseItem(request), ...prs, ...releases].map((item, index) => ({ order: index + 1, ...item }));
};

const noteOf = (item) => {
  if (item.blocked) return [`   BLOCKED: ${item.blocked}`];
  return item.upToDate ? [`   nothing to do: ${item.upToDate}`] : [];
};

/**
 * @param {object[]} plan
 * @returns {string[]} the lines replay plan prints
 */
const planLines = (plan) => plan.flatMap((item) => [`${item.order}. ${item.title}`, ...noteOf(item), ...item.commands.map((command) => `     ${command}`)]);

export { buildPlan, planLines, tagOf };
