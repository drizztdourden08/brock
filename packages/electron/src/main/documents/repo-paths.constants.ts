/* @layer electron-main @kind constants */
const REPO_SEGMENTS: ReadonlySet<string> = new Set(['.git', '.husky', '.vscode', '.idea', '.devcontainer']);

const REPO_SEQUENCES: readonly (readonly string[])[] = [['.github', 'workflows']];

const BARE_REPO_NAMES: readonly string[] = ['head', 'objects', 'refs'];

export { BARE_REPO_NAMES, REPO_SEGMENTS, REPO_SEQUENCES };
