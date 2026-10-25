/* @layer renderer-shell @kind config */
import { lazyComponent } from '@drizztdourden08/brock-react';
import type { ModuleBucket } from '@drizztdourden08/brock-react';
import { meta as directoryPageMeta } from '../screens/controllers/directory.page';
import { meta as diagnosticsPageMeta } from '../screens/controllers/tools/diagnostics.page';
import { meta as logsPageMeta } from '../screens/controllers/tools/logs.page';

const controllersBucket: ModuleBucket = {
  bucket: {
    id: 'controllers',
    title: 'Controllers',
    icon: 'gamepad-2',
    menu: 'hidden',
    switcher: false,
    requiresProfile: false,
    groups: [
      { id: 'connected', label: 'Connected' },
      { id: 'tools', label: 'Tools' },
    ],
  },
  entries: [
    { kind: 'page', bucket: 'controllers', id: 'directory', component: lazyComponent(() => import('../screens/controllers/directory.page')), meta: directoryPageMeta },
    { kind: 'page', bucket: 'controllers', group: 'tools', id: 'diagnostics', component: lazyComponent(() => import('../screens/controllers/tools/diagnostics.page')), meta: diagnosticsPageMeta },
    { kind: 'page', bucket: 'controllers', group: 'tools', id: 'logs', component: lazyComponent(() => import('../screens/controllers/tools/logs.page')), meta: logsPageMeta },
  ],
};

export { controllersBucket };
