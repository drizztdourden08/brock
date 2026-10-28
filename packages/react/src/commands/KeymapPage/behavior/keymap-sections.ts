/* @layer renderer-shell @kind logic */
import type { SettingsSectionData } from '@drizztdourden08/tessera/composites';
import { commands } from '../../commands';
import type { CommandGroupsView } from '../../command.type';
import { findConflicts } from '../../find-conflicts';
import { findShared } from '../../find-shared';
import { listCommands } from '../../list-commands';
import { KEYMAP_SECTION_PREFIX, KEYMAP_STRINGS } from '../KeymapPage.constants';
import { keymapRow } from './keymap-row';

const sectionId = (title: string): string => `${KEYMAP_SECTION_PREFIX}${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const resetAllSection = (changed: number): SettingsSectionData => ({
  id: `${KEYMAP_SECTION_PREFIX}all`,
  title: KEYMAP_STRINGS.resetAllSection,
  rows: [{
    id: 'keymap-reset-all',
    title: KEYMAP_STRINGS.resetAllTitle,
    hint: KEYMAP_STRINGS.resetAllHint,
    noDescription: true,
    actions: [{ id: 'reset-all', label: KEYMAP_STRINGS.resetAll, disabled: changed === 0, confirm: KEYMAP_STRINGS.resetAllConfirm, onSelect: () => commands.reset() }],
  }],
});

const keymapSections = ({ groups, state }: CommandGroupsView): SettingsSectionData[] => {
  const all = new Map(listCommands(state).map((def) => [def.id, def.label]));
  const input = { state, clashes: findConflicts(state), shared: findShared(state), labelOf: (id: string) => all.get(id) ?? id };
  const changed = (ids: readonly string[]): number => ids.filter((id) => state.overrides[id] !== undefined).length;
  return [
    ...groups.map((group): SettingsSectionData => ({
      id: sectionId(group.title),
      title: group.title,
      rows: group.commands.map((def) => keymapRow(def, input)),
      changedCount: changed(group.commands.map((def) => def.id)),
      onReset: () => group.commands.forEach((def) => commands.reset(def.id)),
    })),
    resetAllSection(changed([...all.keys()])),
  ];
};

export { keymapSections };
