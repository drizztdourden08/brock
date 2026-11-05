/* @layer renderer-shell @kind logic */
import type { TabItem } from '@drizztdourden08/tessera/primitives';
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import { FILES_TAB, MUSIC_TAB } from './sound-labels.constants';

const studioTabs = (game: MsuStudioGame<never, never>): TabItem[] => [
  MUSIC_TAB,
  ...game.soundTabs.map((tab): TabItem => ({ id: tab.id, label: tab.label })),
  FILES_TAB,
];

export { studioTabs };
