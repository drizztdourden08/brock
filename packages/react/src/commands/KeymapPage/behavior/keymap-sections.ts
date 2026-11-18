/* @layer renderer-shell @kind logic */
import type { I18n, Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingsSectionData } from '@drizztdourden08/tessera/composites';
import { commands } from '../../commands';
import type { CommandGroupsView } from '../../command.type';
import { findConflicts } from '../../find-conflicts';
import { findShared } from '../../find-shared';
import { groupTitle } from '../../group-title';
import { listCommands } from '../../list-commands';
import { KEYMAP_SECTION_PREFIX } from '../KeymapPage.constants';
import { keymapRow } from './keymap-row';

const sectionId = (title: string): string => `${KEYMAP_SECTION_PREFIX}${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const resetAllSection = (changed: number, t: I18n['t']): SettingsSectionData => ({
  id: `${KEYMAP_SECTION_PREFIX}all`,
  title: t('brock-settings:keymap.resetAll.section'),
  rows: [{
    id: 'keymap-reset-all',
    title: t('brock-settings:keymap.resetAll.title'),
    hint: t('brock-settings:keymap.resetAll.hint'),
    noDescription: true,
    actions: [{ id: 'reset-all', label: t('brock-settings:keymap.resetAll.action'), disabled: changed === 0, confirm: t('brock-settings:keymap.resetAll.confirm'), onSelect: () => commands.reset() }],
  }],
});

const keymapSections = ({ groups, state }: CommandGroupsView, t: I18n['t'], text: (value: Text) => string): SettingsSectionData[] => {
  const all = new Map(listCommands(state).map((def) => [def.id, def.label]));
  const input = { state, clashes: findConflicts(state), shared: findShared(state), labelOf: (id: string) => all.get(id) ?? id, t };
  const changed = (ids: readonly string[]): number => ids.filter((id) => state.overrides[id] !== undefined).length;
  return [
    ...groups.map((group): SettingsSectionData => ({
      id: sectionId(group.title),
      title: text(groupTitle(group.title)),
      rows: group.commands.map((def) => keymapRow(def, input)),
      changedCount: changed(group.commands.map((def) => def.id)),
      onReset: () => group.commands.forEach((def) => commands.reset(def.id)),
    })),
    resetAllSection(changed([...all.keys()]), t),
  ];
};

export { keymapSections };
