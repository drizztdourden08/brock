/* @layer renderer-shell @kind logic */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { titleBarMenu } from './title-bar-menu';
import type { TitleBarItemSpec } from './title-bar-item.type';

const noop = (): void => {};

const toBarAction = (id: string, spec: TitleBarItemSpec): WindowTitleBarAction => {
  const { label, icon } = spec;
  if (spec.kind === 'menu') return { id, label, icon, bar: 'button', onSelect: () => titleBarMenu.open(id, spec.items) };
  if (spec.kind === 'status') return { id, label, icon, bar: 'status', status: spec.status ?? undefined, tone: spec.tone, onSelect: spec.onSelect ?? noop };
  return { id, label, icon, bar: 'button', tone: spec.tone, shortcut: spec.shortcut, onSelect: spec.onSelect };
};

export { toBarAction };
