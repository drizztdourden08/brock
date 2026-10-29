/* @layer electron-main @kind logic */
import { BRIDGE_ACL_ENV } from './bridge.constants';

const aclPowershellOptions = (file: string) => ({ env: { [BRIDGE_ACL_ENV]: file } });

export { aclPowershellOptions };
