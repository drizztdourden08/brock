/* @layer renderer-shell @kind hook */
import { useContext, useEffect, useRef } from 'react';
import { useDeveloperTools } from '../app/useDeveloperTools';
import { SettingsStoreContext } from '../stores/settings-context';
import { useProfilesStore } from '../stores/useProfilesStore';
import { closeDeveloperWidgets } from './close-developer-widgets';

const useDeveloperToolsOff = (): void => {
  const on = useDeveloperTools();
  const profileId = useProfilesStore((s) => s.active?.id ?? null);
  const settings = useContext(SettingsStoreContext);
  const last = useRef({ on, profileId });

  useEffect(() => {
    const was = last.current;
    last.current = { on, profileId };
    const settled = settings === null || settings.getState().hydrated;
    if (was.on && !on && was.profileId === profileId && settled) closeDeveloperWidgets();
  }, [on, profileId, settings]);
};

export { useDeveloperToolsOff };
