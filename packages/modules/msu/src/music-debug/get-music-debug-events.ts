/* @layer core @kind logic */
import type { MsuDebugEvent } from '../types';
import { musicDebugState } from './music-debug-state';

const getMusicDebugEvents = (): MsuDebugEvent[] => musicDebugState.events;

export { getMusicDebugEvents };
