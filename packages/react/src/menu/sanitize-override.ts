/* @layer renderer-shell @kind logic */
import { OVERRIDE_CHECKS, OVERRIDE_WANTS } from './menu-config.constants';
import type { MenuEntryOverride, MenuIssue } from './menu-config.type';

const isField = (field: string): field is keyof MenuEntryOverride => Object.hasOwn(OVERRIDE_CHECKS, field);

const sanitizeOverride = (key: string, raw: unknown, issues: MenuIssue[]): MenuEntryOverride => {
  if (raw === undefined) return {};
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    issues.push({ key, message: `the menu entry "${key}" must be an object of overrides` });
    return {};
  }
  const kept: Record<string, unknown> = {};
  for (const [field, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    if (!isField(field)) issues.push({ key, message: `the menu entry "${key}" has an unknown field "${field}"` });
    else if (OVERRIDE_CHECKS[field](value)) kept[field] = value;
    else issues.push({ key, message: `the menu entry "${key}" ${field} must be ${OVERRIDE_WANTS[field]}` });
  }
  return kept;
};

export { sanitizeOverride };
