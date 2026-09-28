/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../../screens/screen.type';
import type { CatalogInput } from '../palette.type';

const screenAllowed = (screen: ScreenDef, input: Pick<CatalogInput, 'isDev' | 'hasProfile'>): boolean =>
  (screen.devOnly !== true || input.isDev) && (screen.requiresProfile === false || input.hasProfile);

export { screenAllowed };
