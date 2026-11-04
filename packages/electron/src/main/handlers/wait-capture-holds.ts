/* @layer electron-main @kind logic */
import { captureHolds } from './capture-holds';

const waitCaptureHolds = (ms: number): Promise<boolean> => captureHolds.settledWithin(ms);

export { waitCaptureHolds };
