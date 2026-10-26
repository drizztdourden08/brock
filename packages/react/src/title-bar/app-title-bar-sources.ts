/* @layer renderer-shell @kind logic */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { getAppLog } from '../log/get-app-log';
import type { TitleBarActionSource } from '../modules/renderer-module.type';
import { toBarAction } from './to-bar-action';
import { actionsMenuId } from './actions-menu-id';
import { titleBarActionsMenu } from './title-bar-actions-menu';
import type { TitleBarActionsMenu, TitleBarItemEntry, TitleBarItemSpec } from './title-bar-item.type';
import { volumeItems } from './volume-items';

const barActionOf = (id: string, spec: TitleBarItemSpec): WindowTitleBarAction => {
  if (spec.kind === 'volume') volumeItems.add(id);
  return toBarAction(id, spec);
};

const sourceOf = ({ id, source }: TitleBarItemEntry): TitleBarActionSource => {
  if (typeof source !== 'function') return barActionOf(id, source);
  return (): WindowTitleBarAction | null => {
    const spec = source();
    return spec ? barActionOf(id, spec) : null;
  };
};

const warn = (message: string): void => { getAppLog().log('app', message, 'warn'); };

const isStandalone = ({ source }: TitleBarItemEntry): boolean => typeof source !== 'function' && source.kind === 'volume';

const unused = (entries: readonly TitleBarItemEntry[], taken: readonly string[]): TitleBarItemEntry[] => {
  const used = new Set(taken);
  return entries.filter((entry) => {
    if (!used.has(entry.id)) {
      used.add(entry.id);
      return true;
    }
    warn(`Title bar item "${entry.id}" is dropped: a standard or module item already uses that id, and their order stays fixed.`);
    return false;
  });
};

const appTitleBarSources = (entries: readonly TitleBarItemEntry[], taken: readonly string[], menu?: TitleBarActionsMenu): TitleBarActionSource[] => {
  const kept = unused(entries, taken);
  if (menu === undefined) return kept.map(sourceOf);
  const id = actionsMenuId(menu);
  if ([...taken, ...kept.map((entry) => entry.id)].includes(id)) {
    warn(`The title bar actions menu id "${id}" is already used by another item, so the actions stay separate buttons.`);
    return kept.map(sourceOf);
  }
  const folded = kept.filter((entry) => !isStandalone(entry));
  return [...kept.filter(isStandalone).map(sourceOf), ...(folded.length === 0 ? [] : [titleBarActionsMenu(folded, menu)])];
};

export { appTitleBarSources };
