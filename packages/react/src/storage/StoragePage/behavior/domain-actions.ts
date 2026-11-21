/* @layer renderer-shell @kind logic */
import type { DataDomainDef, DomainUsage } from '@drizztdourden08/brock-core';
import { formatBytes } from '@drizztdourden08/brock-core';
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { SettingAction } from '../../../settings/settings.type';
import type { StorageActions } from '../StoragePage.type';

type Resolve = (value: Text) => string;

const sizeText = (usage: DomainUsage | undefined, text: Resolve): string =>
  text(usage ? msg('brock-shell:storage.size', { bytes: formatBytes(usage.bytes), count: usage.count }) : msg('brock-shell:storage.size.unknown'));

const cleanAction = (def: DataDomainDef, days: number, actions: StorageActions, text: Resolve): SettingAction => {
  const name = text(def.label);
  return {
    id: `clean-${days}`,
    label: text(msg('brock-shell:storage.action.clean', { days })),
    icon: 'history',
    confirm: {
      title: msg('brock-shell:storage.clean.title', { name, days }),
      message: msg('brock-shell:storage.clean.message', { name, days }),
      confirmLabel: msg('brock-shell:storage.confirm.delete'),
      variant: 'danger',
    },
    onSelect: () => actions.clean(def, days),
  };
};

const domainActions = (def: DataDomainDef, usage: DomainUsage | undefined, actions: StorageActions, text: Resolve): SettingAction[] => [
  { id: 'open', label: text(msg('brock-shell:storage.action.open')), icon: 'folder-open', onSelect: () => actions.reveal(def) },
  ...(def.cleanOlderThanDays ?? []).map((days) => cleanAction(def, days, actions, text)),
  ...(def.clearable === false ? [] : [{
    id: 'clear',
    label: text(msg('brock-shell:storage.action.clear')),
    icon: 'trash-2',
    tone: 'danger',
    disabled: usage?.count === 0,
    confirm: {
      title: msg('brock-shell:storage.clear.title', { name: text(def.label) }),
      message: msg('brock-shell:storage.clear.message', { size: sizeText(usage, text), name: text(def.label) }),
      confirmLabel: msg('brock-shell:storage.confirm.clear'),
      variant: 'danger',
    },
    onSelect: () => actions.clean(def, null),
  } satisfies SettingAction]),
];

export { domainActions };
