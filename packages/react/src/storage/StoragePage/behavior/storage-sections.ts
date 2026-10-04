/* @layer renderer-shell @kind logic */
import type { SettingsSectionData, SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import type { DataDomainDef } from '@drizztdourden08/brock-core';
import { formatBytes } from '@drizztdourden08/brock-core';
import { rowActions } from '../../../settings/SettingsLayout/behavior/row-actions';
import type { ActionRowInput, StorageSectionsInput } from '../StoragePage.type';
import { domainActions } from './domain-actions';

const actionRow = ({ id, title, description, hint, actions }: ActionRowInput): SettingsSectionRow => ({
  id, title, description, hint, actions: rowActions(actions),
});

const domainRow = (def: DataDomainDef, input: StorageSectionsInput): SettingsSectionRow => {
  const usage = input.state.usage[def.domain];
  return actionRow({
    id: `storage-${def.domain}`,
    title: def.label,
    description: usage ? `${formatBytes(usage.bytes)} · ${usage.count} item${usage.count === 1 ? '' : 's'}` : 'Measuring the folder',
    hint: def.description ?? `Data/${def.dir}`,
    actions: domainActions(def, usage, input.actions),
  });
};

const transferRows = (input: StorageSectionsInput): SettingsSectionRow[] => {
  const { state, actions, chosen, onChoose } = input;
  const portable = state.domains.filter((def) => def.portable !== false);
  const none = chosen.length === 0;
  return [
    {
      id: 'storage-export-domains',
      title: 'Folders to export',
      hint: 'Pick the folders that go into the export.',
      noDescription: true,
      input: { kind: 'multi', value: chosen, options: portable.map((def) => ({ value: def.domain, label: def.label })), onChange: onChoose },
    },
    actionRow({
      id: 'storage-export',
      title: 'Export',
      description: 'Copies the chosen folders into one zip file or a new folder.',
      hint: 'An export can be imported back here or on another computer.',
      actions: [
        { id: 'export-zip', label: 'Export to zip', icon: 'archive', disabled: none, onSelect: () => actions.exportTo('zip', chosen) },
        { id: 'export-folder', label: 'Export to folder', icon: 'upload', disabled: none, onSelect: () => actions.exportTo('folder', chosen) },
      ],
    }),
    actionRow({
      id: 'storage-import',
      title: 'Import',
      description: 'Replaces folders with the ones in an export. You confirm first.',
      hint: 'Only folders this app knows are imported.',
      actions: [
        { id: 'import-zip', label: 'Import zip', icon: 'download', onSelect: () => actions.importFrom('zip') },
        { id: 'import-folder', label: 'Import folder', icon: 'folder', onSelect: () => actions.importFrom('folder') },
      ],
    }),
  ];
};

const locationRow = ({ state, actions }: StorageSectionsInput): SettingsSectionRow => {
  const total = Object.values(state.usage).reduce((sum, usage) => sum + (usage?.bytes ?? 0), 0);
  return actionRow({
    id: 'storage-location',
    title: 'Data folder',
    description: state.location ? `${state.location.path} · ${formatBytes(total)}` : 'Finding the data folder',
    hint: state.location?.osLabel ?? 'Where this app keeps its files.',
    actions: [{ id: 'open-root', label: 'Open folder', icon: 'folder-open', disabled: state.location?.canReveal !== true, onSelect: actions.revealRoot }],
  });
};

const storageSections = (input: StorageSectionsInput): SettingsSectionData[] => {
  const { domains } = input.state;
  return [
    { id: 'storage-overview', title: 'Overview', rows: [locationRow(input)] },
    { id: 'storage-domains', title: 'Folders', rows: domains.map((def) => domainRow(def, input)) },
    ...(domains.some((def) => def.portable !== false) ? [{ id: 'storage-transfer', title: 'Export and import', rows: transferRows(input) }] : []),
  ];
};

export { storageSections };
