/* @layer renderer-shell @kind logic */
import { NO_PICK_OPTIONS } from '../PaletteHost.constants';
import type { PickScopeModel, ScopeModelInput } from '../PaletteHost.type';
import { scopePlaceholder } from './scope-placeholder';

const buildScopeModel = ({ picking, active, loaded, current, text }: ScopeModelInput): PickScopeModel => {
  const scopes = picking?.scopes;
  if (scopes === undefined) return { options: picking?.options ?? NO_PICK_OPTIONS, scope: null, placeholder: undefined };
  return { options: loaded ?? NO_PICK_OPTIONS, scope: active?.id ?? null, placeholder: scopePlaceholder(scopes, current, active, text) };
};

export { buildScopeModel };
