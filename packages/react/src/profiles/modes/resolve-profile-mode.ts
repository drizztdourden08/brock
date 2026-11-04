/* @layer renderer-shell @kind logic */
import type { Profile } from '@drizztdourden08/brock-core';
import type { ProfileModeDef } from './profile-mode.type';

const resolveProfileMode = (modes: readonly ProfileModeDef[], profile: Profile, config: Record<string, unknown> | null): ProfileModeDef | null => {
  const ranked = modes.map((mode, index) => ({ mode, index })).sort((a, b) => b.mode.rank - a.mode.rank || a.index - b.index);
  return ranked.find((entry) => entry.mode.matches(profile, config))?.mode ?? null;
};

export { resolveProfileMode };
