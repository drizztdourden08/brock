/* @layer renderer-shell @kind logic */
import type { SettingsSectionData, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { DataDomainDef } from '@drizztdourden08/brock-core';
import { formatBytes } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { rowActions } from '../../../settings/SettingsLayout/behavior/row-actions';
import type { ActionRowInput, StorageSectionsInput } from '../StoragePage.type';
import { domainActions } from './domain-actions';

const actionRow = ({ id, title, description, hint, actions, runner }: ActionRowInput): SettingsSectionRow => ({
  id, title, description, hint, actions: rowActions(actions, {}, { id, runner }),
});

const domainRow = (def: DataDomainDef, input: StorageSectionsInput): SettingsSectionRow => {
  const { text } = input;
  const usage = input.state.usage[def.domain];
  return actionRow({
    id: `storage-${def.domain}`,
    title: text(def.label),
    description: text(usage ? msg('brock-shell:storage.domain.usage', { bytes: formatBytes(usage.bytes), count: usage.count }) : msg('brock-shell:storage.domain.measuring')),
    hint: def.description === undefined ? `Data/${def.dir}` : text(def.description),
    actions: input.state.manage ? domainActions(def, usage, input.actions, text) : [],
    runner: input.runner,
  });
};

const transferRows = (input: StorageSectionsInput): SettingsSectionRow[] => {
  const { state, actions, chosen, onChoose, runner, text } = input;
  const portable = state.domains.filter((def) => def.portable !== false);
  const none = chosen.length === 0;
  return [
    {
      id: 'storage-export-domains',
      title: text(msg('brock-shell:storage.export.folders')),
      hint: text(msg('brock-shell:storage.export.foldersHint')),
      noDescription: true,
      input: { kind: 'multi', value: chosen, options: portable.map((def) => ({ value: def.domain, label: text(def.label) })), onChange: onChoose },
    },
    actionRow({
      id: 'storage-export',
      title: text(msg('brock-shell:storage.export.title')),
      description: text(msg('brock-shell:storage.export.description')),
      hint: text(msg('brock-shell:storage.export.hint')),
      actions: [
        { id: 'export-zip', label: text(msg('brock-shell:storage.export.zip')), icon: 'archive', disabled: none, onSelect: () => actions.exportTo('zip', chosen) },
        { id: 'export-folder', label: text(msg('brock-shell:storage.export.folder')), icon: 'upload', disabled: none, onSelect: () => actions.exportTo('folder', chosen) },
      ],
      runner,
    }),
    actionRow({
      id: 'storage-import',
      title: text(msg('brock-shell:storage.import.title')),
      description: text(msg('brock-shell:storage.import.description')),
      hint: text(msg('brock-shell:storage.import.hint')),
      actions: [
        { id: 'import-zip', label: text(msg('brock-shell:storage.import.zip')), icon: 'download', onSelect: () => actions.importFrom('zip') },
        { id: 'import-folder', label: text(msg('brock-shell:storage.import.folder')), icon: 'folder', onSelect: () => actions.importFrom('folder') },
      ],
      runner,
    }),
  ];
};

const locationRow = ({ state, actions, runner, text }: StorageSectionsInput): SettingsSectionRow => {
  const total = Object.values(state.usage).reduce((sum, usage) => sum + (usage?.bytes ?? 0), 0);
  return actionRow({
    id: 'storage-location',
    title: text(msg('brock-shell:storage.location.title')),
    description: text(state.location ? msg('brock-shell:storage.location.description', { path: state.location.path, size: formatBytes(total) }) : msg('brock-shell:storage.location.finding')),
    hint: state.location?.osLabel ?? text(msg('brock-shell:storage.location.hint')),
    actions: state.manage ? [{ id: 'open-root', label: text(msg('brock-shell:storage.action.open')), icon: 'folder-open', disabled: state.location?.canReveal !== true, onSelect: actions.revealRoot }] : [],
    runner,
  });
};

const storageSections = (input: StorageSectionsInput): SettingsSectionData[] => {
  const { domains } = input.state;
  const { text } = input;
  return [
    { id: 'storage-overview', title: text(msg('brock-shell:storage.section.overview')), rows: [locationRow(input)] },
    { id: 'storage-domains', title: text(msg('brock-shell:storage.section.folders')), rows: domains.map((def) => domainRow(def, input)) },
    ...(input.state.manage && domains.some((def) => def.portable !== false) ? [{ id: 'storage-transfer', title: text(msg('brock-shell:storage.section.transfer')), rows: transferRows(input) }] : []),
  ];
};

export { storageSections };
