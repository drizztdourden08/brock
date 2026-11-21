/* @layer renderer-components @kind hook */
import { useEffect, useRef } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { newProfile } from '../../../bindings/profile/new-profile';
import type { ActionBinding } from '../../../bindings/bindings.type';
import type { InputProfile } from '../../../bindings/input-profile.type';
import { DEFAULT_PROFILE_ID } from '../ControlsSettings.constants';
import type { UseProfileLoaderArgs } from '../ControlsSettings.type';

const defaultProfile = (keyboardDefaults: readonly ActionBinding[], text: (value: Text) => string): InputProfile => ({
  ...newProfile(0, keyboardDefaults, text),
  id: DEFAULT_PROFILE_ID,
  name: text(msg('input:device.keyboard')),
  isDefault: true,
});

const useProfileLoader = ({ store, keyboardDefaults, setProfiles, setActiveProfile }: UseProfileLoaderArgs) => {
  const text = useText();
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    void (async () => {
      let loaded = await store.load();
      if (loaded.length === 0) {
        loaded = [defaultProfile(keyboardDefaults, text)];
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
