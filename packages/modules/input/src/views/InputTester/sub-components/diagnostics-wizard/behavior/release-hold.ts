/* @layer renderer-shell @kind logic */
import { inputApi } from '../../../../../renderer/input-api';

const releaseHold = (): Promise<boolean> => inputApi().capture.releaseHold();

export { releaseHold };
