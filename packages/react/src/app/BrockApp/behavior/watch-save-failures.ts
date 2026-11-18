/* @layer renderer-shell @kind logic */
import { msg, type Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../../../i18n/fallback-text';
import type { SettingsStore } from '../../../stores/settings-store.type';
import { toast } from '../../../toast/toast';

const watchSaveFailures = <S extends object>(store: SettingsStore<S>, text: (value: Text) => string = fallbackText): (() => void) => store.subscribe((state, prev) => {
  if (state.saveStatus !== 'failed' || prev.saveStatus === 'failed') return;
  const retry = { label: text(msg('brock-shell:subtitle.retry')), onSelect: () => void store.getState().retrySave() };
  toast(`Settings not saved: ${state.saveError ?? 'unknown error'}.`, { variant: 'danger', duration: 0, action: retry });
});

export { watchSaveFailures };
