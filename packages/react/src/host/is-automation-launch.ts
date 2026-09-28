/* @layer renderer-shell @kind logic */
import { hostApi } from './host-api';

const isAutomationLaunch = (): boolean => hostApi()?.startup.automation ?? false;

export { isAutomationLaunch };
