/* @layer renderer-shell @kind constants */
import type { WidgetPrefItem } from '@drizztdourden08/brock-react';
import { DEFAULT_REFRESH_HZ, DEFAULT_SECTION_IDS, REFRESH_CHOICES, SECTION_IDS } from '../game-info.constants';

const GAME_INFO_PREFS: readonly WidgetPrefItem[] = [
  {
    key: 'view',
    label: 'View',
    description: 'Show every block of a section, or only its compact lines.',
    control: { kind: 'choice', options: [{ value: 'full', label: 'Full' }, { value: 'compact', label: 'Compact' }] },
    default: 'full',
  },
  {
    key: 'refreshHz',
    label: 'Refresh rate',
    description: 'How many times a second the game is read.',
    control: { kind: 'choice', options: REFRESH_CHOICES.map((hz) => ({ value: String(hz), label: `${hz} Hz` })) },
    default: String(DEFAULT_REFRESH_HZ),
  },
  { key: 'hexIds', label: 'Hex ids', description: 'Show ids as hexadecimal.', default: false },
  { key: 'hideSpoilers', label: 'Hide spoilers', description: 'Mask values the player has not met yet.', default: true },
  {
    key: 'sections',
    label: 'Sections',
    description: 'Which sections the widget lists.',
    control: { kind: 'multi', options: SECTION_IDS.map((value) => ({ value, label: value })) },
    default: [...DEFAULT_SECTION_IDS],
  },
];

export { GAME_INFO_PREFS };
