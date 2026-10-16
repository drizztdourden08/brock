/* @layer renderer-shell @kind logic */
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import { getAppLog } from '../log/get-app-log';
import type { TitleBarActionSource } from '../modules/renderer-module.type';
import { toBarAction } from './to-bar-action';
import type { TitleBarItemEntry, TitleBarItemSpec } from './title-bar-item.type';
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

const appTitleBarSources = (entries: readonly TitleBarItemEntry[], taken: readonly string[]): TitleBarActionSource[] => {
  const used = new Set(taken);
  return entries.flatMap((entry) => {
    if (used.has(entry.id)) {
      getAppLog().log('app', `Title bar item "${entry.id}" is dropped: a standard or module item already uses that id, and their order stays fixed.`, 'warn');
      return [];
    }
    used.add(entry.id);
    return [sourceOf(entry)];
  });
};

export { appTitleBarSources };
