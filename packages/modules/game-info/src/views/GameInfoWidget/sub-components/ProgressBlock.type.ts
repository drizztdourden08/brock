/* @layer renderer-shell @kind types */
import type { ProgressBlock as ProgressBlockData } from '../../../provider/block.type';
import type { GameInfoPrefsValue } from '../GameInfoWidget.type';

interface ProgressBlockProps {
  block: ProgressBlockData;
  prefs: GameInfoPrefsValue;
}

export type { ProgressBlockProps };
