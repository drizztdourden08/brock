/* @layer renderer-shell @kind logic */
import { hostApi } from './host-api';

const isReviewLaunch = (): boolean => hostApi()?.startup.flags.review !== undefined;

export { isReviewLaunch };
