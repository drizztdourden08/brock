/* @layer core @kind logic */
import { ANY_DEVICE } from '../bindings.constants';
import type { DeviceScopedMap } from './device-keys.type';

const scopedEntries = <K, V>(map: DeviceScopedMap<K, V>, deviceKey: string): [K, V][] => {
  const entries: [K, V][] = [];
  const own = map.get(deviceKey);
  if (own) entries.push(...own);
  if (deviceKey !== ANY_DEVICE) {
    const any = map.get(ANY_DEVICE);
    if (any) entries.push(...any);
  }
  return entries;
};

export { scopedEntries };
