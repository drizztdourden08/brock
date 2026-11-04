/* @layer renderer-shell @kind logic */
import { DEFAULT_SECTION_IDS } from '../game-info.constants';
import type { SectionId } from '../provider/section-id.type';
import { readStoredPref } from './read-stored-pref';

const readSections = (): readonly SectionId[] => {
  const value = readStoredPref('sections');
  return Array.isArray(value) ? (value as SectionId[]) : DEFAULT_SECTION_IDS;
};

export { readSections };
