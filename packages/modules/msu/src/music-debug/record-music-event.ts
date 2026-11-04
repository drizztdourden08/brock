/* @layer core @kind logic */
import type { MsuDebugEvent, MsuDebugOwner } from '../types';
import { MAX_EVENTS } from './music-debug.constants';
import { musicDebugState } from './music-debug-state';
import { notifyMusicDebug } from './notify-music-debug';

type NewEvent = Omit<MsuDebugEvent, 'id' | 'at'>;

const appendEvent = (event: NewEvent): void => {
  const state = musicDebugState;
  state.events = [...state.events.slice(-(MAX_EVENTS - 1)), { ...event, id: state.nextId++, at: Date.now() }];
};

const countEvent = (key: string, channel: string, label: string, owner: MsuDebugOwner): void => {
  const { counters } = musicDebugState;
  const row = counters.get(key)
    ?? { key, channel, label, raised: 0, pack: 0, chip: 0, skipped: 0, lastAt: 0 };
  row.raised += 1;
  if (owner === 'pack') row.pack += 1;
  else if (owner === 'chip') row.chip += 1;
  else row.skipped += 1;
  row.lastAt = Date.now();
  counters.set(key, row);
};

const recordMusicEvent = (event: NewEvent, key: string, label: string): void => {
  appendEvent(event);
  countEvent(key, event.channel, label, event.owner);
  notifyMusicDebug();
};

export { recordMusicEvent };
