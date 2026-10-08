/* @layer renderer-shell @kind logic */
import { getAppLog } from '../log/get-app-log';

const reportRenderRetry = (scope: string): void => {
  getAppLog().log('app', `${scope} drawn again after its error`);
};

export { reportRenderRetry };
