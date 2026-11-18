/* @layer renderer-shell @kind logic */
import type { SectionDef } from '../../settings/settings.type';
import type { SettingsSource } from './screen-tree.type';

const settingsSections = (source: SettingsSource, settings: object): SectionDef[] =>
  typeof source === 'function' ? (source as (value: object) => SectionDef[])(settings) : [...source];

export { settingsSections };
