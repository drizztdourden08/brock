/* @layer renderer-shell @kind constants */
import type { SearchAction } from '../../search/search.type';
import type { PickOption } from '../palette.type';
import type { LoadedScopes } from './PaletteHost.type';

const NO_ACTIONS: readonly SearchAction[] = [];
const NO_PICK_OPTIONS: readonly PickOption[] = [];
const EMPTY_LOADED: LoadedScopes = { owner: null, byScope: {} };

export { EMPTY_LOADED, NO_ACTIONS, NO_PICK_OPTIONS };
