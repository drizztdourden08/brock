/* @layer core @kind types */
import type { RandomizerLogText } from './randomizer-log-text.type';

type RandomizerLogLine = keyof RandomizerLogText;

type RandomizerLog = (msg: string, level?: 'info' | 'warn' | 'error', line?: RandomizerLogLine) => void;

export type { RandomizerLog, RandomizerLogLine };
