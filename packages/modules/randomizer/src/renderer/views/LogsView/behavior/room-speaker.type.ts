/* @layer renderer-shell @kind types */
import type { RandomizerSession } from '../../../../session';

interface RoomSpeaker {
  say(text: string): void;
}

type SpeakingSession = RandomizerSession & RoomSpeaker;

export type { RoomSpeaker, SpeakingSession };
