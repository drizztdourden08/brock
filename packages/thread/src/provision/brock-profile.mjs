/* @layer tooling-scripts @kind logic */
import { mkdirSync } from 'node:fs';
import { excludeLocally } from '../worktree/exclude-worktrees.mjs';
import { profilePaths } from './profile-paths.mjs';

const STORE_EXCLUDE = '/.brock/profile-config.json';

const isMainCheckout = (worktree) => worktree.path === worktree.main;

const seedProfile = (paths, worktree) => {
  if (paths.profile.exists()) return;
  const now = Date.now();
  const main = isMainCheckout(worktree);
  const name = main ? 'Default' : `agent/${worktree.name}`;
  paths.profile.write({ id: worktree.name, name, created: now, lastPlayed: now, automation: !main });
  worktree.log('profile.json created.');
};

const seedConfig = (paths, worktree) => {
  if (paths.config.exists()) return;
  const retained = paths.store.read();
  paths.config.write(retained ?? {});
  worktree.log(retained ? `config.json restored from ${paths.store.path}.` : `config.json created with the app's new-profile default. Changes to it are kept in ${paths.store.path}.`);
};

const seedAppState = (paths, worktree) => {
  if (paths.appState.exists()) return;
  paths.appState.write({ lastProfileId: worktree.name });
  worktree.log('app.json created; the profile opens by default.');
};

const run = (worktree) => {
  const paths = profilePaths(worktree);
  mkdirSync(paths.profileDir, { recursive: true });
  seedProfile(paths, worktree);
  seedConfig(paths, worktree);
  seedAppState(paths, worktree);
};

const afterLaunch = (worktree) => {
  const paths = profilePaths(worktree);
  const config = paths.config.read();
  if (!config) return;
  excludeLocally(worktree.main, STORE_EXCLUDE);
  paths.store.write(config);
  worktree.log('Profile settings kept for the next worktree.');
};

/**
 * @returns {import('../workspace/workspace.type.mjs').ProvisionStep}
 */
const brockProfile = () => ({ name: 'brock-profile', run, afterLaunch });

export { brockProfile };
