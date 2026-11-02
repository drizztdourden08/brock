/* @layer renderer-shell @kind logic */
import type { PickScope } from './palette.type';

const stepScope = (scopes: readonly PickScope[], current: string | null, direction: 1 | -1): PickScope | undefined => {
  if (scopes.length === 0) return undefined;
  const at = scopes.findIndex((scope) => scope.id === current);
  return scopes[(Math.max(at, 0) + direction + scopes.length) % scopes.length];
};

export { stepScope };
