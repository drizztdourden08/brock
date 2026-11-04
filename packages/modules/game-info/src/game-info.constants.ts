/* @layer renderer-shell @kind constants */
import type { SectionId } from './provider/section-id.type';

const GAME_INFO_WIDGET_ID = 'game-info';

const SECTION_IDS: readonly SectionId[] = ['location', 'party', 'story', 'inventory', 'techs', 'music', 'raw'];

const DEFAULT_SECTION_IDS: readonly SectionId[] = SECTION_IDS.filter((id) => id !== 'raw');

const REFRESH_CHOICES: readonly number[] = [1, 4, 10];

const DEFAULT_REFRESH_HZ = 4;

export { DEFAULT_REFRESH_HZ, DEFAULT_SECTION_IDS, GAME_INFO_WIDGET_ID, REFRESH_CHOICES, SECTION_IDS };
