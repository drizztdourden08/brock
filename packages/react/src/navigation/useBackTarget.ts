/* @layer renderer-shell @kind hook */
import { navigationSteps } from './navigation-steps';
import type { ScreenParams } from './navigation.type';
import { useNavigationStore } from './useNavigationStore';

const useBackTarget = (): ScreenParams | null => useNavigationStore(navigationSteps.backTarget);

export { useBackTarget };
