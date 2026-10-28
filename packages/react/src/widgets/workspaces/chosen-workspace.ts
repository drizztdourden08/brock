/* @layer renderer-shell @kind logic */
import { byOrder } from '../../screens/conventions/by-order';
import { UNORDERED } from '../../screens/conventions/screens.constants';
import { isShown } from '../../screens/show/is-shown';
import type { ShowContext } from '../../screens/show/show.type';
import type { WorkspaceDef } from './workspace.type';

const matching = (defs: readonly WorkspaceDef[], show?: ShowContext): WorkspaceDef[] =>
  defs
    .filter((def) => def.when !== undefined && isShown(def.when, show))
    .map((def) => ({ def, order: def.order ?? UNORDERED, label: def.label }))
    .sort(byOrder)
    .map(({ def }) => def);

const chosenWorkspace = (defs: readonly WorkspaceDef[], show?: ShowContext): string | null => matching(defs, show)[0]?.id ?? null;

export { chosenWorkspace, matching };
