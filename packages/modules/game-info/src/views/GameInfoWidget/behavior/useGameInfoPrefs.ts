/* @layer renderer-shell @kind hook */
import { useWidgetPref } from '@drizztdourden08/brock-react';
import { DEFAULT_SECTION_IDS, GAME_INFO_WIDGET_ID } from '../../../game-info.constants';
import type { GameInfoPrefsValue } from '../GameInfoWidget.type';

const useGameInfoPrefs = (): GameInfoPrefsValue => {
  const [view] = useWidgetPref<string>(GAME_INFO_WIDGET_ID, 'view', 'full');
  const [hexIds] = useWidgetPref<boolean>(GAME_INFO_WIDGET_ID, 'hexIds', false);
  const [hideSpoilers] = useWidgetPref<boolean>(GAME_INFO_WIDGET_ID, 'hideSpoilers', true);
  const [sections] = useWidgetPref<readonly string[]>(GAME_INFO_WIDGET_ID, 'sections', DEFAULT_SECTION_IDS);
  return { view, hexIds, hideSpoilers, sections };
};

export { useGameInfoPrefs };
