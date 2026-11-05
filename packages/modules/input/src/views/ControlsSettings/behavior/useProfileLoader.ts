/* @layer renderer-components @kind hook */
import { useEffect, useRef } from 'react';
import { newProfile } from '../../../bindings/profile/new-profile';
import type { ActionBinding } from '../../../bindings/bindings.type';
import type { InputProfile } from '../../../bindings/input-profile.type';
import { DEFAULT_PROFILE_ID } from '../ControlsSettings.constants';
import type { UseProfileLoaderArgs } from '../ControlsSettings.type';

const defaultProfile = (keyboardDefaults: readonly ActionBinding[]): InputProfile => ({
  ...newProfile(0, keyboardDefaults),
  id: DEFAULT_PROFILE_ID,
  name: 'Keyboard',
  isDefault: true,
});

const useProfileLoader = ({ store, keyboardDefaults, setProfiles, setActiveProfile }: UseProfileLoaderArgs) => {
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    void (async () => {
      let loaded = await store.load();
      if (loaded.length === 0) {
        loaded = [defaultProfile(keyboardDefaults)];
        await store.save(loaded);
      }
      const active = loaded.find((p) => p.id === store.activeId) ?? loaded[0] ?? null;
      setProfiles(loaded);
      setActiveProfile(active);
      if (active) store.activate(active);
    })();
  }, [store, keyboardDefaults, setProfiles, setActiveProfile]);
};

export { useProfileLoader };
