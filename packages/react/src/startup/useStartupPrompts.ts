/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { isAutomationLaunch } from '../host/is-automation-launch';
import { useProfilesStore } from '../stores/useProfilesStore';
import { isTourSettled } from '../tours/tour-settled';
import { useTourStore } from '../tours/useTourStore';
import { runStartupPrompts } from './run-startup-prompts';
import { startupContext } from './startup-context';
import type { StartupPromptsInput } from './startup-prompts-input.type';

const useStartupPrompts = <S extends object>({ ready, settingsStore, prompts }: StartupPromptsInput<S>): void => {
  const profile = useProfilesStore((s) => s.active);
  const hydrated = settingsStore((s) => s.hydrated && s.profileId === profile?.id);
  const toured = useTourStore(isTourSettled);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !ready || !profile || !hydrated || !toured || prompts.length === 0 || isAutomationLaunch()) return;
    started.current = true;
    void runStartupPrompts(prompts, startupContext(profile, settingsStore));
  }, [ready, profile, hydrated, toured, prompts, settingsStore]);
};

export { useStartupPrompts };
