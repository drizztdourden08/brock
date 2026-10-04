/* @layer renderer-shell @kind logic */
import type { SettingsStore } from '../../../stores/settings-store.type';
import { toast } from '../../../toast/toast';

const watchSaveFailures = <S extends object>(store: SettingsStore<S>): (() => void) => store.subscribe((state, prev) => {
  if (state.saveStatus !== 'failed' || prev.saveStatus === 'failed') return;
  const retry = { label: 'Retry', onSelect: () => void store.getState().retrySave() };
  toast(`Settings not saved: ${state.saveError ?? 'unknown error'}.`, { variant: 'danger', duration: 0, action: retry });
});

export { watchSaveFailures };
