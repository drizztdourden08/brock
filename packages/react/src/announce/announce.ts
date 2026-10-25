/* @layer renderer-shell @kind logic */
import { ANNOUNCE_CLEAR_MS, ANNOUNCE_SET_DELAY_MS, DEFAULT_POLITENESS } from './announce.constants';
import type { AnnounceOptions, Politeness } from './announce.type';
import { useAnnounceStore } from './useAnnounceStore';

const pending: Partial<Record<Politeness, ReturnType<typeof setTimeout>>> = {};

const announce = (message: string, options: AnnounceOptions = {}): void => {
  const text = message.trim();
  if (text === '') return;
  const politeness = options.politeness ?? DEFAULT_POLITENESS;
  const { setText } = useAnnounceStore.getState();
  clearTimeout(pending[politeness]);
  setText(politeness, '');
  pending[politeness] = setTimeout(() => {
    setText(politeness, text);
    pending[politeness] = setTimeout(() => setText(politeness, ''), ANNOUNCE_CLEAR_MS);
  }, ANNOUNCE_SET_DELAY_MS);
};

export { announce };
