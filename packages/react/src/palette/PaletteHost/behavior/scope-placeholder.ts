/* @layer renderer-shell @kind logic */
import type { PickScope } from '../../palette.type';
import { stepScope } from '../../step-scope';

const scopePlaceholder = (scopes: readonly PickScope[], current: string | null, active: PickScope | undefined): string | undefined => {
  if (active === undefined) return undefined;
  const next = stepScope(scopes, current, 1);
  const hint = next === undefined || next.id === active.id ? '' : `, Tab for ${next.label}`;
  return `Search ${active.label}${hint}`;
};

export { scopePlaceholder };
