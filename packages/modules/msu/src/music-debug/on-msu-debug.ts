/* @layer core @kind logic */
import type { MsuRollEvent } from './music-debug.type';
import { recordMusicEvent } from './record-music-event';

const onMsuDebug = (event: MsuRollEvent): void => {
  const outcome = event.passed ? 'played' : 'skipped';
  recordMusicEvent(
    {
      channel: event.channel,
      detail: `roll ${event.chance}% -> ${outcome} - ${event.layerName}`,
      owner: event.passed ? 'pack' : 'skipped',
    },
    `roll:${event.channel}:${event.programId}:${event.layerId}`,
    `${event.layerName} @${event.chance}%`,
  );
};

export { onMsuDebug };
