/* @layer renderer-shell @kind hook */
import type { TitleBarControls } from '@drizztdourden08/brock-core';
import { useCapability } from '../../../platform/useCapability';

const useBarControls = (controls: TitleBarControls): TitleBarControls | false => (useCapability('windowChrome') ? controls : false);

export { useBarControls };
