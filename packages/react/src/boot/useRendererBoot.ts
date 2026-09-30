/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { useBrock } from '../app/useBrock';
import type { SettingsStore } from '../stores/settings-store.type';
import { useProfilesStore } from '../stores/useProfilesStore';
import type { RendererBootTask } from './renderer-boot.type';
import { runRendererBoot } from './run-renderer-boot';
import { rendererBootTasks } from './tasks/renderer-boot-tasks';
import { useFirstFrameSignal } from './useFirstFrameSignal';

const useRendererBoot = <S extends object>(settings: SettingsStore<S>, contributed: readonly RendererBootTask[]): void => {
  const { product } = useBrock();
  const started = useRef(false);
  useFirstFrameSignal();

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const extras = () => ({ product, profile: useProfilesStore.getState().active });
    void runRendererBoot(rendererBootTasks(settings, contributed), extras);
  }, []);
};

export { useRendererBoot };
