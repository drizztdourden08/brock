/* @layer renderer-shell @kind logic */
import { stickyParams } from '../../navigation/sticky-params';
import { useNavigationStore } from '../../navigation/useNavigationStore';
import type { ScreenParams } from '../../navigation/navigation.type';

const stickyShowParams = (): ScreenParams => {
  const { active, params } = useNavigationStore.getState();
  return stickyParams.pick(active, params);
};

export { stickyShowParams };
