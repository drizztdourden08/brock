/* @layer renderer-shell @kind logic */
import { isRecord } from '../collections/is-record';
import type { NavigationHistory, SavedNavigation, ScreenParams } from './navigation.type';

const paramsOf = (value: unknown): ScreenParams => (isRecord(value) ? value : {});

const keptRecord = <T>(value: unknown, known: (id: string) => boolean, read: (entry: unknown) => T): Record<string, T> =>
  (isRecord(value) ? Object.fromEntries(Object.entries(value).filter(([id]) => known(id)).map(([id, entry]) => [id, read(entry)])) : {});

const trailOf = (value: unknown): ScreenParams[] => (Array.isArray(value) ? value.filter(isRecord) : []);

const readSavedNavigation = (value: unknown, known: (id: string) => boolean): SavedNavigation | null => {
  if (!isRecord(value)) return null;
  const active = typeof value.active === 'string' && known(value.active) ? value.active : null;
  const history: NavigationHistory = keptRecord(value.history, known, trailOf);
  return { active, params: active === null ? {} : paramsOf(value.params), history, remembered: keptRecord(value.remembered, known, paramsOf) };
};

export { readSavedNavigation };
