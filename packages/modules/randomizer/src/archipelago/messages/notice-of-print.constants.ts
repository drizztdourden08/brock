/* @layer core @kind constants */
import type { NoticeTone } from './notice.type';

const TONE_OF_PART: Readonly<Record<string, NoticeTone>> = {
  player_id: 'player',
  player_name: 'player',
  item_id: 'item',
  item_name: 'item',
};

export { TONE_OF_PART };
