/* @layer renderer-shell @kind hook */
import type { TitleBarControls } from '@drizztdourden08/brock-core';
import { useCapability } from '../../../platform/useCapability';
import { NO_WINDOW_CONTROLS } from '../BrockApp.constants';

const useBarControls = (controls: TitleBarControls): TitleBarControls => (useCapability('windowChrome') ? controls : NO_WINDOW_CONTROLS);

export { useBarControls };
