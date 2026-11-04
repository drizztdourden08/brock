/* @layer renderer-shell @kind logic */
import type { ScreenDef } from '../../screens/screen.type';
import type { ReviewEnv } from '../review.type';
import { SQUARE_SCREENS } from './widget-review.constants';

const layered = (screen: ScreenDef): boolean => screen.layer !== 'own';

/** A registered screen drawn in a screen layer, or null. */
const squareScreen = ({ screens, homeScreen }: ReviewEnv): string | null => {
  const drawn = screens.filter((screen) => layered(screen) && screen.id !== homeScreen);
  const preferred = SQUARE_SCREENS.find((id) => drawn.some((screen) => screen.id === id));
  return preferred ?? drawn[0]?.id ?? null;
};

export { squareScreen };
