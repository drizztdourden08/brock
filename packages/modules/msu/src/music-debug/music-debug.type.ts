/* @layer core @kind types */
import type { MsuHost } from '../config';
import type { subscribeMsuDebug } from '../player/debug-bus';
import type { MsuDebugEvent } from '../types';

type MsuRollEvent = Parameters<Parameters<typeof subscribeMsuDebug>[0]>[0];

interface MusicDebugCounter {
  key: string;
  channel: string;
  label: string;
  raised: number;
  pack: number;
  chip: number;
  skipped: number;
  lastAt: number;
}

interface MusicTraceHandlers {
  onSoundTrace: (channel: number, id: number, pan: number, claimed: number) => void;
  onMusicTrace: (ctrl: number, scene: number, external: number) => void;
}

type MusicDebugState = {
  nextId: number;
  events: MsuDebugEvent[];
  counters: Map<string, MusicDebugCounter>;
  listeners: Set<() => void>;
  armed: boolean;
  installed: boolean;
  host: MsuHost | null;
  unsubscribers: (() => void)[];
  countersSnapshot: MusicDebugCounter[];
  countersDirtyAt: number;
};

export type { MsuRollEvent, MusicDebugCounter, MusicDebugState, MusicTraceHandlers };
