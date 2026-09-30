/* @layer renderer-shell @kind logic */
import type { SettingsStore } from '../../stores/settings-store.type';
import type { RendererBootTask } from '../renderer-boot.type';
import { firstFrameTask } from './first-frame-task';
import { fontsTask } from './fonts-task';
import { imagesTask } from './images-task';
import { profilesTask } from './profiles-task';
import { settingsTask } from './settings-task';

const rendererBootTasks = <S extends object>(settings: SettingsStore<S>, contributed: readonly RendererBootTask[]): RendererBootTask[] => {
  const tasks = [profilesTask, settingsTask(settings), fontsTask, imagesTask, ...contributed];
  return [...tasks, firstFrameTask(tasks.map((task) => task.id))];
};

export { rendererBootTasks };
