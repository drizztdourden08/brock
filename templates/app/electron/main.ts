/* @layer electron-main @kind entry */
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { mainModules } from '../.brock/modules.main';
import { mainBootTasks } from '../.brock/boot.main';
import { mainHandlers } from '../.brock/handlers.main';
import { product } from '../src/product';

bootstrapApp(product, {
  modules: mainModules,
  bootTasks: mainBootTasks,
  handlers: mainHandlers,
  dataDomains: [
    { domain: 'profiles', label: 'Profiles', dir: 'profiles', description: 'Each profile with its settings.', clearable: false },
    { domain: 'logs', label: 'Logs', dir: 'debug', description: 'Session and console logs.', cleanOlderThanDays: [7, 30], portable: false },
  ],
});
