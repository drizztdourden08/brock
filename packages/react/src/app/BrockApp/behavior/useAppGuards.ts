/* @layer renderer-shell @kind hook */
import type { BrockAppProfiles } from '../BrockApp.type';
import { useProfileRemovalGuard } from './useProfileRemovalGuard';
import { useQuitAnswer } from './useQuitAnswer';
import { useQuitGuards } from './useQuitGuards';
import type { QuitGuardSources } from './useQuitGuards.type';

const useAppGuards = (quit: QuitGuardSources, profiles: BrockAppProfiles | undefined): void => {
  useQuitGuards(quit);
  useQuitAnswer();
  useProfileRemovalGuard(profiles?.onBeforeRemove);
};

export { useAppGuards };
