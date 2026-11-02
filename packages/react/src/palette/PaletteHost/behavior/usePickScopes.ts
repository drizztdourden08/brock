/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { PalettePick } from '../../palette.type';
import { stepScope } from '../../pick-scope';
import { usePaletteStore } from '../../usePaletteStore';
import { NO_PICK_OPTIONS } from '../PaletteHost.constants';
import type { PickScopeModel } from '../PaletteHost.type';
import { scopeDirection } from './pick-scope-keys';
import { useLoadedScope } from './useLoadedScope';

const usePickScopes = (picking: PalettePick | null): PickScopeModel => {
  const open = usePaletteStore((s) => s.open);
  const current = usePaletteStore((s) => s.pickScope);
  const setPickScope = usePaletteStore((s) => s.setPickScope);
  const scopes = picking?.scopes;
  const active = scopes?.find((scope) => scope.id === current);
  const loaded = useLoadedScope(picking, active);
  const listening = open && scopes !== undefined && scopes.length > 1;

  useEffect(() => {
    if (!listening || scopes === undefined) return undefined;
    const onKeyDown = (event: KeyboardEvent): void => {
      const direction = scopeDirection(event);
      const next = direction === 0 ? undefined : stepScope(scopes, current, direction);
      if (next === undefined) return;
      event.preventDefault();
      event.stopPropagation();
      setPickScope(next.id);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [listening, scopes, current, setPickScope]);

  if (scopes === undefined) return { options: picking?.options ?? NO_PICK_OPTIONS, scope: null, placeholder: undefined };
  const next = stepScope(scopes, current, 1);
  const hint = next === undefined || next.id === active?.id ? '' : `, Tab for ${next.label}`;
  return { options: loaded ?? NO_PICK_OPTIONS, scope: active?.id ?? null, placeholder: active === undefined ? undefined : `Search ${active.label}${hint}` };
};

export { usePickScopes };
