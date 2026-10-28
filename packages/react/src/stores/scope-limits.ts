/* @layer renderer-shell @kind logic */
import { DEFAULT_SCOPE_MAX_KEYS, DEFAULT_SCOPE_MAX_SCOPES } from './ui-views-scope.constants';
import type { ScopeLimits } from './ui-views-scope.type';

const current: ScopeLimits = { maxKeys: DEFAULT_SCOPE_MAX_KEYS, maxScopes: DEFAULT_SCOPE_MAX_SCOPES };

const positive = (name: string, value: number): number => {
  if (!Number.isInteger(value) || value < 1) throw new Error(`The scope limit ${name} must be a whole number of at least 1`);
  return value;
};

const configure = (next: Partial<ScopeLimits>): ScopeLimits => {
  if (next.maxKeys !== undefined) current.maxKeys = positive('maxKeys', next.maxKeys);
  if (next.maxScopes !== undefined) current.maxScopes = positive('maxScopes', next.maxScopes);
  return { ...current };
};

const scopeLimits = { current, positive, configure };

export { scopeLimits };
