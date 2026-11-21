/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { TabItem } from '@drizztdourden08/tessera/primitives';
import type { MsuStudioGame } from '../../game/msu-studio-game.type';
import { FILES_TAB, MUSIC_TAB } from './sound-labels.constants';

const studioTabs = (game: MsuStudioGame<never, never>, text: (value: Text) => string): TabItem[] => [
  { id: MUSIC_TAB.id, label: text(MUSIC_TAB.label) },
  ...game.soundTabs.map((tab): TabItem => ({ id: tab.id, label: tab.label })),
  { id: FILES_TAB.id, label: text(FILES_TAB.label) },
];

export { studioTabs };
