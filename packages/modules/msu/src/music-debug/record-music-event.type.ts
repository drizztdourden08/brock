/* @layer core @kind types */
import type { MsuDebugEvent } from '../types';

type MusicEventInput = Omit<MsuDebugEvent, 'id' | 'at'>;

export type { MusicEventInput };
