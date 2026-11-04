/* @layer core @kind types */
import type { RandomizerWorldGame } from '../world';

type WorldStamp = Pick<RandomizerWorldGame, 'game' | 'worldSchema'>;

export type { WorldStamp };
