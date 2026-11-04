/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import type { MsuDebugOwner } from '../types';
import { hexId } from './hex-id';
import { MUSIC_CHANNEL } from './music-debug.constants';
import type { MusicTraceHandlers } from './music-debug.type';
import { recordMusicEvent } from './record-music-event';

const createTraceHandlers = (config: MsuGameConfig<never>): MusicTraceHandlers => ({
  onSoundTrace: (channel, id, pan, claimed) => {
    const name = config.soundChannels.find((entry) => entry.coreIndex === channel)?.name ?? String(channel);
    const owner: MsuDebugOwner = claimed ? 'pack' : 'chip';
    const panNote = pan ? ` pan ${hexId(pan)}` : '';
    recordMusicEvent({ channel: name, detail: `${hexId(id)}${panNote}`, owner }, `${name}:${id}`, hexId(id));
  },
  onMusicTrace: (ctrl, scene, external) => {
    const owner: MsuDebugOwner = external ? 'pack' : 'chip';
    const label = config.musicLabels?.[ctrl] ?? `track ${ctrl}`;
    recordMusicEvent(
      { channel: MUSIC_CHANNEL, detail: `${label} (scene ${scene})`, owner },
      `${MUSIC_CHANNEL}:${ctrl}`,
      label,
    );
  },
});

export { createTraceHandlers };
