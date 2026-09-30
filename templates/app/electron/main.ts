/* @layer electron-main @kind entry */
import { bootstrapApp } from '@drizztdourden08/brock-electron/main';
import { mainModules } from '../.brock/modules.main';
import { mainBootTasks } from '../.brock/boot.main';
import { product } from '../src/product';

bootstrapApp(product, { modules: mainModules, bootTasks: mainBootTasks });
