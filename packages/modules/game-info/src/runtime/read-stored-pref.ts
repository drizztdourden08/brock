/* @layer renderer-shell @kind logic */
import { useWidgetPrefStore } from '@drizztdourden08/brock-react';
import { GAME_INFO_WIDGET_ID } from '../game-info.constants';

const readStoredPref = (key: string): unknown => useWidgetPrefStore.getState().byWidget[GAME_INFO_WIDGET_ID]?.[key];

export { readStoredPref };
