/* @layer renderer-shell @kind logic */
import type { PalettePick, PickOption, PickScope } from '../../palette.type';
import { NO_PICK_OPTIONS } from '../PaletteHost.constants';
import type { PickScopeModel } from '../PaletteHost.type';
import { scopePlaceholder } from './scope-placeholder';

const buildScopeModel = (picking: PalettePick | null, active: PickScope | undefined, loaded: readonly PickOption[] | null, current: string | null): PickScopeModel => {
  const scopes = picking?.scopes;
  if (scopes === undefined) return { options: picking?.options ?? NO_PICK_OPTIONS, scope: null, placeholder: undefined };
  return { options: loaded ?? NO_PICK_OPTIONS, scope: active?.id ?? null, placeholder: scopePlaceholder(scopes, current, active) };
};

export { buildScopeModel };
