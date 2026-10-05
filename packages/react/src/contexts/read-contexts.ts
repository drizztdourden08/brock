/* @layer renderer-shell @kind logic */
import type { AppContext, AppContexts } from './contexts.type';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const contextOf = (value: unknown): AppContext | null => {
  if (!isRecord(value) || typeof value.active !== 'boolean') return null;
  return 'data' in value ? { active: value.active, data: value.data } : { active: value.active };
};

const readContexts = (value: unknown): AppContexts => {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).flatMap(([name, entry]) => {
    const context = contextOf(entry);
    return context ? [[name, context]] : [];
  }));
};

export { readContexts };
