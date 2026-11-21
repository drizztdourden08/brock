/* @layer renderer-shell @kind logic */
import type { DataDomainDef, DomainUsage } from '@drizztdourden08/brock-core';
import { formatBytes } from '@drizztdourden08/brock-core';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingAction } from '../../../settings/settings.type';
import type { StorageActions } from '../StoragePage.type';

const sizeText = (usage: DomainUsage | undefined): string => (usage ? `${formatBytes(usage.bytes)} in ${usage.count} item${usage.count === 1 ? '' : 's'}` : 'what is there');

const cleanAction = (def: DataDomainDef, days: number, actions: StorageActions, name: string): SettingAction => ({
  id: `clean-${days}`,
  label: `Older than ${days} days`,
  icon: 'history',
  confirm: {
    title: `Delete ${name} older than ${days} days?`,
    message: `Every file and folder in ${name} that has not changed for ${days} days is deleted. This cannot be undone.`,
    confirmLabel: 'Delete',
    variant: 'danger',
  },
  onSelect: () => actions.clean(def, days),
});

const domainActions = (def: DataDomainDef, usage: DomainUsage | undefined, actions: StorageActions, text: (value: Text) => string): SettingAction[] => [
  { id: 'open', label: 'Open folder', icon: 'folder-open', onSelect: () => actions.reveal(def) },
  ...(def.cleanOlderThanDays ?? []).map((days) => cleanAction(def, days, actions, text(def.label))),
  ...(def.clearable === false ? [] : [{
    id: 'clear',
    label: 'Clear',
    icon: 'trash-2',
    tone: 'danger',
    disabled: usage?.count === 0,
    confirm: {
      title: `Clear ${text(def.label)}?`,
      message: `${sizeText(usage)} is deleted from ${text(def.label)}. This cannot be undone.`,
      confirmLabel: 'Clear',
      variant: 'danger',
    },
    onSelect: () => actions.clean(def, null),
  } satisfies SettingAction]),
];

export { domainActions };
