/* @layer electron-main @kind logic */
import type { RouteInput } from './route-sdl3-event.type';
import type { Sdl3AddedEvent, Sdl3Event } from './sdl3.type';

const emitSnapshot = ({ emit, registry }: RouteInput): void => emit('input:devices', registry.snapshot());

const routeAdded = (input: RouteInput, event: Sdl3AddedEvent): void => {
  const { emit, registry } = input;
  const device = registry.add(event);
  const { mapping: _mapping, ...info } = device;
  emit('input:added', { ...info, busType: registry.busTypeOf(device) });
  emitSnapshot(input);
};

const routeRemoved = (input: RouteInput, sdlId: number): void => {
  const deviceKey = input.registry.remove(sdlId);
  if (!deviceKey) return;
  input.emit('input:removed', deviceKey);
  emitSnapshot(input);
};

const routeState = ({ emit, registry }: RouteInput, sdlId: number, buttons: boolean[], axes: number[]): void => {
  const deviceKey = registry.keyFor(sdlId);
  if (deviceKey) emit('input:state', deviceKey, buttons, axes);
};

const routeSdl3Event = (input: RouteInput, event: Sdl3Event): void => {
  const { emit, log } = input;
  switch (event.type) {
    case 'added': routeAdded(input, event); break;
    case 'removed': routeRemoved(input, event.id); break;
    case 'state': routeState(input, event.id, event.buttons, event.axes); break;
    case 'error': log(`input: SDL3 ${event.message}`, 'warn'); break;
    case 'raw': emit('input:raw', { vendorId: event.vendorId, productId: event.productId, reportId: event.reportId, bytes: event.bytes }); break;
    case 'joystick': emit('input:joystick', { id: event.id, buttons: event.buttons, axes: event.axes, hats: event.hats }); break;
    case 'gamepad-hold': emit('input:holdChanged', event.held); break;
  }
};

export { routeSdl3Event };
