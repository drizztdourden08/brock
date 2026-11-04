/* @layer core @kind types */
import type { OnlineHost } from '../../archipelago';

type GameLinkHost = Pick<
  OnlineHost,
  'isFileInPlay' | 'onSaveSwap' | 'goalReached' | 'setDeathLink' | 'killLink' | 'onLinkDied'
>;

export type { GameLinkHost };
