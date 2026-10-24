/* @layer renderer-shell @kind logic */
import { readSource } from './read-source';
import { sectionKeys } from './section-keys';
import type { Section, SettingValues } from './settings.type';

const sourceValues = (section: Section): SettingValues | undefined =>
  (section.source === undefined ? undefined : readSource(section.source, sectionKeys(section)));

export { sourceValues };
