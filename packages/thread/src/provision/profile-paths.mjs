/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { jsonFile } from './json-file.mjs';

const STORE = ['.brock', 'profile-config.json'];

/**
 * @param {import('../workspace/workspace.type.mjs').WorktreeContext} worktree
 * @returns {{ dataDir: string, profileDir: string, profile: ReturnType<typeof jsonFile>, config: ReturnType<typeof jsonFile>, appState: ReturnType<typeof jsonFile>, store: ReturnType<typeof jsonFile> }}
 */
const profilePaths = (worktree) => {
  const dataDir = join(worktree.userData, 'Data');
  const profileDir = join(dataDir, 'profiles', worktree.name);
  return {
    dataDir,
    profileDir,
    profile: jsonFile(join(profileDir, 'profile.json')),
    config: jsonFile(join(profileDir, 'config.json')),
    appState: jsonFile(join(dataDir, 'app.json')),
    store: jsonFile(join(worktree.main, ...STORE)),
  };
};

export { profilePaths };
