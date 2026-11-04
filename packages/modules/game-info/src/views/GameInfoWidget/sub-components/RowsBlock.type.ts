/* @layer renderer-shell @kind types */
import type { RowsBlock as RowsBlockData } from '../../../provider/block.type';
import type { GameInfoPrefsValue } from '../GameInfoWidget.type';

interface RowsBlockProps {
  block: RowsBlockData;
  prefs: GameInfoPrefsValue;
}

export type { RowsBlockProps };
