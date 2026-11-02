/* @layer renderer-shell @kind logic */
import type { PalettePick, PickScope } from './palette.type';

const startScope = (pick: PalettePick): string | null => {
  const scopes = pick.scopes ?? [];
  if (pick.scope !== undefined && scopes.some((scope) => scope.id === pick.scope)) return pick.scope;
  return scopes[0]?.id ?? null;
};

const stepScope = (scopes: readonly PickScope[], current: string | null, direction: 1 | -1): PickScope | undefined => {
  if (scopes.length === 0) return undefined;
  const at = scopes.findIndex((scope) => scope.id === current);
  return scopes[(Math.max(at, 0) + direction + scopes.length) % scopes.length];
};

export { startScope, stepScope };
