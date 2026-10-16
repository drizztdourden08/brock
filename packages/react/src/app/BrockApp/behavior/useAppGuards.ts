/* @layer renderer-shell @kind hook */
import type { BeforeQuit } from '../../../quit/quit.type';
import type { BrockAppProfiles } from '../BrockApp.type';
import { useProfileRemovalGuard } from './useProfileRemovalGuard';
import { useQuitGuards } from './useQuitGuards';

const useAppGuards = (moduleQuitGuards: readonly BeforeQuit[], beforeQuit: BeforeQuit | undefined, profiles: BrockAppProfiles | undefined): void => {
  useQuitGuards(moduleQuitGuards, beforeQuit);
  useProfileRemovalGuard(profiles?.onBeforeRemove);
};

export { useAppGuards };
