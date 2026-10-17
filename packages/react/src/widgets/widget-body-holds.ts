/* @layer renderer-shell @kind logic */
import { bodyHolds } from '../screenshot/body-holds';
import type { BodyStatus } from '../screenshot/screenshot.type';
import { memberKitOf } from './kits/member-kit-of';
import { useWidgetKitStore } from './kits/useWidgetKitStore';
import { useForcedWidgetStore } from './useForcedWidgetStore';
import { widgetVisible } from './widget-visible';

const widgetBodyKey = (id: string): string => `widget:${id}`;
const overlayBodyKey = (id: string): string => `overlay:${id}`;

const widgetStatus = (id: string) => (): BodyStatus => {
  if (useForcedWidgetStore.getState().pending.includes(id)) return 'waiting';
  return widgetVisible(id) ? 'open' : 'closed';
};

const overlayStatus = (kit: string, id: string) => (): BodyStatus => {
  const { active, views } = useWidgetKitStore.getState();
  return active === kit && views[kit]?.hidden.includes(id) !== true ? 'open' : 'closed';
};

const requestKit = (kit: string): void => {
  const def = useWidgetKitStore.getState().kits.find((each) => each.id === kit);
  for (const overlay of def?.overlays ?? []) bodyHolds.request(overlayBodyKey(overlay.id), overlayStatus(kit, overlay.id));
};

const requestWidget = (id: string): void => {
  bodyHolds.request(widgetBodyKey(id), widgetStatus(id));
  const kit = memberKitOf(useWidgetKitStore.getState(), id);
  if (kit !== null) requestKit(kit);
};

const widgetBodyHolds = {
  widgets: (ids: readonly string[]): void => { for (const id of ids) requestWidget(id); },
  kit: requestKit,
  widgetKey: widgetBodyKey,
  overlayKey: overlayBodyKey,
};

export { widgetBodyHolds };
