/* @layer renderer-shell @kind logic */
import { useWidgetPrefStore } from '@drizztdourden08/brock-react';
import { DEFAULT_REFRESH_HZ, DEFAULT_SECTION_IDS, GAME_INFO_WIDGET_ID } from '../game-info.constants';
import type { SectionId } from '../provider/section-id.type';

const stored = (key: string): unknown => useWidgetPrefStore.getState().byWidget[GAME_INFO_WIDGET_ID]?.[key];

const readRefreshHz = (): number => {
  const hz = Number(stored('refreshHz'));
  return Number.isFinite(hz) && hz > 0 ? hz : DEFAULT_REFRESH_HZ;
};

const readSections = (): readonly SectionId[] => {
  const value = stored('sections');
  return Array.isArray(value) ? (value as SectionId[]) : DEFAULT_SECTION_IDS;
};

export { readRefreshHz, readSections };
