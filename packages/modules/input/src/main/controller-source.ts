/* @layer electron-main @kind logic */
import type { ControllerSource, SourceInput } from './controller-source.type';
import { createControllerRegistry } from './controller-registry';
import { routeSdl3Event } from './route-sdl3-event';

const createControllerSource = ({ addon, emit, log }: SourceInput): ControllerSource => {
  const registry = createControllerRegistry(addon);
  let started = false;

  const start = (): void => {
    if (started) return;
    started = true;
    addon.start((event) => routeSdl3Event({ emit, log, registry }, event));
    registry.refreshListed();
  };

  const stop = (): void => {
    if (!started) return;
    started = false;
    addon.stop();
    registry.clear();
  };

  const rescan = (): void => {
    addon.rescan();
    registry.refreshListed();
    emit('input:devices', registry.snapshot());
  };

  const rumble = (deviceKey: string, low: number, high: number, durationMs: number): boolean => {
    const device = registry.device(deviceKey);
    return device ? addon.rumble(device.sdlId, low, high, durationMs) : false;
  };

  return { start, stop, rescan, rumble, snapshot: registry.snapshot, listed: registry.listed };
};

export { createControllerSource };
