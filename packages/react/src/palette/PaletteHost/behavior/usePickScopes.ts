/* @layer renderer-shell @kind hook */
import type { PalettePick } from '../../palette.type';
import { usePaletteStore } from '../../usePaletteStore';
import type { PickScopeModel } from '../PaletteHost.type';
import { buildScopeModel } from './build-scope-model';
import { useLoadedScope } from './useLoadedScope';
import { useScopeKeys } from './useScopeKeys';

const usePickScopes = (picking: PalettePick | null): PickScopeModel => {
  const open = usePaletteStore((s) => s.open);
  const current = usePaletteStore((s) => s.pickScope);
  const setPickScope = usePaletteStore((s) => s.setPickScope);
  const scopes = picking?.scopes;
  const active = scopes?.find((scope) => scope.id === current);
  const loaded = useLoadedScope(picking, active);
  useScopeKeys(open && scopes !== undefined && scopes.length > 1 ? scopes : undefined, current, setPickScope);
  return buildScopeModel(picking, active, loaded, current);
};

export { usePickScopes };
