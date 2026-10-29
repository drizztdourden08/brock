/* @layer tooling-scripts @kind logic */

const quoted = (text) => (/[\s"]/.test(text) ? `"${text.replace(/"/g, '\\"')}"` : text);

/**
 * @param {{ project: string, branch: string, integration: string, version: string, commit: string, channel: string }} release
 * @returns {{ title: string, args: string[] }} the coord pr open arguments for the release branch
 */
const prRequest = (release) => {
  const title = `release: v${release.version}`;
  const body = `Local release of ${release.project} ${release.channel} v${release.version}. The tarballs and release.json are in the release store.`;
  return {
    title,
    args: ['pr', 'open', title, '--head', release.branch, '--base', release.integration, '--commit', release.commit, '--body', body],
  };
};

/**
 * @param {{ release: object, cwd: string, exec: Function, log: (line: string) => void }} input
 * @returns {void} opens the record, or prints the command
 */
const openReleasePr = ({ release, cwd, exec, log }) => {
  const { args } = prRequest(release);
  try {
    log(String(exec('coord', args, { cwd, env: { COORD_PROJECT: release.project } })).trim() || 'Pull request opened.');
  } catch {
    log(`Open the pull request yourself: coord ${args.map(quoted).join(' ')}`);
  }
};

export { openReleasePr };
