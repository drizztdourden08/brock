/* @layer renderer-shell @kind hook */
import { useCapability } from '../../../platform/useCapability';
import { usePlatform } from '../../../platform/usePlatform';

const useTitleBarShown = (onMobile: boolean): boolean => {
  const capable = useCapability('titleBar');
  const { formFactor } = usePlatform().info;
  return capable && (onMobile || formFactor !== 'mobile');
};

export { useTitleBarShown };
