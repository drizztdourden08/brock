/* @layer renderer-shell @kind logic */
import type { SettingsStore } from '../../stores/settings-store.type';
import { useProfilesStore } from '../../stores/useProfilesStore';
import { abortable } from '../abortable';
import { SETTINGS_TASK } from '../boot.constants';
import type { RendererBootTask } from '../renderer-boot.type';

const hydratedFor = <S extends object>(store: SettingsStore<S>, profileId: string): Promise<void> =>
  new Promise((resolve) => {
    const done = (): boolean => {
      const { hydrated, profileId: current } = store.getState();
      return hydrated && current === profileId;
    };
    if (done()) {
      resolve();
      return;
    }
    const stop = store.subscribe(() => {
      if (!done()) return;
      stop();
      resolve();
    });
  });

const settingsTask = <S extends object>(store: SettingsStore<S>): RendererBootTask => ({
  id: SETTINGS_TASK,
  label: 'Loading settings',
  after: ['profiles'],
  run: async ({ signal }) => {
    const active = useProfilesStore.getState().active;
    if (!active) return;
    await abortable(hydratedFor(store, active.id), signal);
  },
});

export { settingsTask };
