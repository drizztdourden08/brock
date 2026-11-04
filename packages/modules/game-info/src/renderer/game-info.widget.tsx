/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import type { WidgetDef } from '@drizztdourden08/brock-react';
import { GAME_INFO_WIDGET_ID } from '../game-info.constants';
import { GAME_INFO_PREFS } from '../settings/game-info-prefs.constants';
import { GameInfoWidget } from '../views/GameInfoWidget';

const gameInfoWidget: WidgetDef = {
  id: GAME_INFO_WIDGET_ID,
  label: 'Game info',
  icon: 'info',
  defaultVisibility: 'always',
  defaultSide: 'right',
  defaultDockedSize: 320,
  defaultFloatingSize: { width: 420, height: 520 },
  popOut: true,
  prefs: GAME_INFO_PREFS,
  render: () => createElement(GameInfoWidget),
};

export { gameInfoWidget };
