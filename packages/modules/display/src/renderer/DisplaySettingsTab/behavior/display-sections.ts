/* @layer renderer-shell @kind logic */
import type { Section, SettingItem } from '@drizztdourden08/brock-react';
import { DISPLAY_ROW_COPY, DISPLAY_SECTION_COPY } from '../DisplaySettingsTab.constants';
import type { DisplayRowId, DisplaySectionId } from '../DisplaySettingsTab.type';

const WINDOW_ROWS: readonly DisplayRowId[] = ['windowMode', 'displayMonitor'];

const REFRESH_RATE_ROWS: readonly DisplayRowId[] = ['detectedRate', 'syncedRateInFullscreen', 'syncedRateTargetHz', 'changeRate'];

const searchItem = (id: DisplayRowId): SettingItem => {
  const { label, description, hint, keywords } = DISPLAY_ROW_COPY[id];
  return { key: id, label, description, hint, keywords };
};

const searchSection = (id: DisplaySectionId, rows: readonly DisplayRowId[]): Section => ({
  id,
  title: DISPLAY_SECTION_COPY[id].title,
  items: rows.map(searchItem),
});

const displaySections = (hasWindow: boolean): Section[] => [
  ...(hasWindow ? [searchSection('window', WINDOW_ROWS)] : []),
  searchSection('refreshRate', REFRESH_RATE_ROWS),
];

export { displaySections };
