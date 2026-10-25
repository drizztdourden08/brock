/* @layer renderer-shell @kind logic */
import type { RendererBootTask } from '@drizztdourden08/brock-react';
import { startControllerEventLog } from '../controller-event-log/controller-event-log';
import { startControllerFamilyCache } from './start-controller-family-cache';
import { startControllerInputFeed } from './start-controller-input-feed';
import { startControllerNameCache } from './start-controller-name-cache';

const controllerInputBootTask: RendererBootTask = {
  id: 'controller-input',
  label: 'Starting controller input',
  weight: 1,
  run: () => {
    startControllerInputFeed();
    startControllerNameCache();
    startControllerFamilyCache();
    startControllerEventLog();
  },
};

export { controllerInputBootTask };
