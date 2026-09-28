/* @layer renderer-shell @kind hook */
import { useSettingValue } from '../../../stores/useSettingValue';
import { CHROMELESS_WINDOW_MODES } from '../BrockApp.constants';

const useTitleBarHidden = (): boolean => {
  const mode = useSettingValue('windowMode');
  return typeof mode === 'string' && CHROMELESS_WINDOW_MODES.includes(mode);
};

export { useTitleBarHidden };
