/* @layer renderer-shell @kind logic */
import { inputApi } from '../../../../../renderer/input-api';

const restoreHold = (): Promise<boolean> => inputApi().capture.restoreHold();

export { restoreHold };
