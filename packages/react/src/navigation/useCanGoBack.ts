/* @layer renderer-shell @kind hook */
import { navigationSteps } from './navigation-steps';
import { useNavigationStore } from './useNavigationStore';

const useCanGoBack = (): boolean => useNavigationStore(navigationSteps.canGoBack);

export { useCanGoBack };
