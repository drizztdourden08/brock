/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../../screens/screen.type';
import type { CatalogInput } from '../search.type';
import { isShown } from '../../screens/show/is-shown';

const screenAllowed = (screen: ScreenDef, input: Pick<CatalogInput, 'isDev' | 'hasProfile' | 'show'>): boolean =>
  (screen.devOnly !== true || input.isDev) && (screen.requiresProfile === false || input.hasProfile) && isShown(screen.show, input.show);

export { screenAllowed };
