/* @layer core @kind types */
import type { MsuSoundChannel } from '../config';

type SoundBus = MsuSoundChannel['bus'];

type SoundReplacement = Record<SoundBus, boolean>;

type ClaimedCounts = Record<SoundBus, number>;

export type { ClaimedCounts, SoundBus, SoundReplacement };
