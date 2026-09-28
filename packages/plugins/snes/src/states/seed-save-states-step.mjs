/* @layer tooling-scripts @kind logic */
import { join } from 'node:path';
import { appDataDir } from '../rom/app-data-root.mjs';
import { snesOptions } from '../snes-options.mjs';
import { profileDirOf } from './profile-saves.mjs';
import { seedFixtures } from './seed-fixtures.mjs';
import { seedQuickSave } from './seed-quick-save.mjs';

const slotIndexOf = (requested) => {
  const index = Number(requested) - 1;
  if (!Number.isInteger(index) || index < 0) throw new Error(`slot must be a slot number >= 1, got "${requested}".`);
  return index;
};

/**
 * @param {{ realDataDir?: string, slot?: number | string, fixturesDir?: string }} [options]
 * @returns {{ name: string, run: (worktree: object) => void }}
 */
const seedSaveStates = ({ realDataDir, slot, ...overrides } = {}) => ({
  name: 'save-states',
  run: (worktree) => {
    const states = snesOptions('states', worktree.workspace, overrides);
    const profileDir = profileDirOf(worktree, states);
    seedFixtures({
      fixtureDir: join(worktree.path, states.fixturesDir),
      destDir: join(profileDir, states.savesDir, states.manualDir),
      log: worktree.log,
    });
    const requested = slot ?? worktree.options?.slot;
    if (requested == null) return;
    seedQuickSave({
      profileDir,
      slot: slotIndexOf(requested),
      sourceData: realDataDir ?? appDataDir(worktree.main),
      states,
      log: worktree.log,
    });
  },
});

export { seedSaveStates };
