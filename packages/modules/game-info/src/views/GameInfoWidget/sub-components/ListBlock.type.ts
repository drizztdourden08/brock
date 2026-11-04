/* @layer renderer-shell @kind types */
import type { ListBlock as ListBlockData } from '../../../provider/block.type';
import type { GameInfoPrefsValue } from '../GameInfoWidget.type';

interface ListBlockProps {
  block: ListBlockData;
  prefs: GameInfoPrefsValue;
}

export type { ListBlockProps };
