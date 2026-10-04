/* @layer renderer-shell @kind logic */
import type { DataDomainDef, DomainUsage } from '@drizztdourden08/brock-core';
import { formatBytes } from '@drizztdourden08/brock-core';
import type { SettingAction } from '../../../settings/settings.type';
import type { StorageActions } from '../StoragePage.type';

const sizeText = (usage: DomainUsage | undefined): string => (usage ? `${formatBytes(usage.bytes)} in ${usage.count} item${usage.count === 1 ? '' : 's'}` : 'what is there');

const cleanAction = (def: DataDomainDef, days: number, actions: StorageActions): SettingAction => ({
  id: `clean-${days}`,
  label: `Older than ${days} days`,
  icon: 'history',
  confirm: {
    title: `Delete ${def.label} older than ${days} days?`,
    message: `Every file and folder in ${def.label} that has not changed for ${days} days is deleted. This cannot be undone.`,
    confirmLabel: 'Delete',
    variant: 'danger',
  },
  onSelect: () => actions.clean(def, days),
});

const domainActions = (def: DataDomainDef, usage: DomainUsage | undefined, actions: StorageActions): SettingAction[] => [
  { id: 'open', label: 'Open folder', icon: 'folder-open', onSelect: () => actions.reveal(def) },
  ...(def.cleanOlderThanDays ?? []).map((days) => cleanAction(def, days, actions)),
  ...(def.clearable === false ? [] : [{
    id: 'clear',
    label: 'Clear',
    icon: 'trash-2',
    variant: 'danger',
    disabled: usage?.count === 0,
    confirm: {
      title: `Clear ${def.label}?`,
      message: `${sizeText(usage)} is deleted from ${def.label}. This cannot be undone.`,
      confirmLabel: 'Clear',
      variant: 'danger',
    },
    onSelect: () => actions.clean(def, null),
  } satisfies SettingAction]),
];

export { domainActions };
