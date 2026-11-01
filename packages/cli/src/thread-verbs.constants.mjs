/* @layer tooling-scripts @kind constants */

const THREAD_VERBS = Object.freeze(new Set(['worktree', 'launch', 'pr', 'mobile', 'linux', 'release', 'upgrade', 'ci', 'replay']));

const GITHUB_VERBS = Object.freeze(new Set(['release', 'pr', 'replay', 'publish']));

export { GITHUB_VERBS, THREAD_VERBS };
