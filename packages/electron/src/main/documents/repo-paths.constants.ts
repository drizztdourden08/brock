/* @layer electron-main @kind constants */
const REPO_SEGMENTS: ReadonlySet<string> = new Set(['.git', '.husky', '.vscode', '.idea', '.devcontainer']);

const REPO_SEQUENCES: readonly (readonly string[])[] = [['.github', 'workflows']];

const GIT_DIR_FILES: ReadonlySet<string> = new Set(['head', 'commondir', 'gitdir']);

export { GIT_DIR_FILES, REPO_SEGMENTS, REPO_SEQUENCES };
