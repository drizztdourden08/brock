/* @layer renderer-shell @kind logic */
import type { Section } from '../../settings/settings.type';
import type { SettingsSource } from './screen-tree.type';

const settingsSections = (source: SettingsSource, settings: object): Section[] =>
  typeof source === 'function' ? (source as (value: object) => Section[])(settings) : [...source];

export { settingsSections };
