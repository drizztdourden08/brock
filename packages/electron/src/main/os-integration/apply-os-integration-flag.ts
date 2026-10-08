/* @layer electron-main @kind logic */
import { app } from 'electron';
import type { OsIntegrationProduct } from './os-integration.type';
import { OS_INTEGRATION_FLAG } from '../open/open.constants';
import { registerOsIntegration } from './register-os-integration';
import { unregisterOsIntegration } from './unregister-os-integration';

const applyOsIntegrationFlag = (product: OsIntegrationProduct, argv: readonly string[] = process.argv): boolean => {
  const action = argv.find((arg) => arg.startsWith(`${OS_INTEGRATION_FLAG}=`))?.slice(OS_INTEGRATION_FLAG.length + 1);
  if (action === 'register') {
    app.exit(registerOsIntegration(product).success ? 0 : 1);
    return true;
  }
  if (action === 'unregister') {
    unregisterOsIntegration(product);
    app.exit(0);
    return true;
  }
  return false;
};

export { applyOsIntegrationFlag };
