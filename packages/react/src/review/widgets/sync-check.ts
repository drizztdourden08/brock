/* @layer renderer-shell @kind logic */
import { requireHostApi } from '../../host/require-host-api';
import { until } from '../dom/until';
import type { StepTour } from '../review.type';
import { poppedWire } from './popped-wire';
import { probe } from './probe';
import { soon } from './soon';

const taskbarIs = (id: string, wanted: boolean): Promise<boolean> => until(async () => (await probe({ kind: 'window', id })).facts?.taskbar === wanted);

const checkSync = async (tour: StepTour, id: string): Promise<void> => {
  const start = (await probe({ kind: 'window', id })).facts;
  const away = (await probe({ kind: 'focusAway', id })).facts;
  const kept = start?.sync === true && start.taskbar === false && away?.visible === true;
  tour.check('sync-stays-visible', kept, `the synced "${id}" window has no taskbar entry of its own and stayed visible when another window took the focus`, `the synced "${id}" window hid or took a taskbar entry when another window took the focus (${JSON.stringify({ start: start?.taskbar, visible: away?.visible })})`);
  requireHostApi().setWidgetSync(id, false);
  const own = await taskbarIs(id, true);
  const saved = own && await soon(() => poppedWire(id)?.sync === false);
  tour.check('unsynced-taskbar', saved, `the unsynced "${id}" window got its own taskbar entry and the layout saved sync off`, `the unsynced "${id}" window has no taskbar entry or the layout kept sync on`);
  requireHostApi().setWidgetSync(id, true);
  const back = await taskbarIs(id, false) && await soon(() => poppedWire(id)?.sync === true);
  tour.check('resync-drops-taskbar', back, `syncing the "${id}" window again dropped its taskbar entry`, `the "${id}" window kept its taskbar entry after syncing again`);
};

export { checkSync };
