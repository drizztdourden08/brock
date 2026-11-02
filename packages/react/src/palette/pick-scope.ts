/* @layer renderer-shell @kind logic */
import type { PalettePick } from './palette.type';

const startScope = (pick: PalettePick): string | null => {
  const scopes = pick.scopes ?? [];
  if (pick.scope !== undefined && scopes.some((scope) => scope.id === pick.scope)) return pick.scope;
  return scopes[0]?.id ?? null;
};

export { startScope };
