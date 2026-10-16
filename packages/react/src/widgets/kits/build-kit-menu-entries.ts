/* @layer renderer-shell @kind logic */
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import { byOrder } from '../../screens/conventions/by-order';
import { UNORDERED } from '../../screens/conventions/screens.constants';
import { WIDGET_KEY_PREFIX } from '../widget.constants';
import { kitMembers } from './kit-members';
import { kitViewOf } from './kit-view-of';
import { KIT_ICON, KIT_KEY_PREFIX, KIT_OPEN_ICON, KIT_OVERLAY_ICON, KIT_OVERLAY_KEY_PREFIX, KIT_WORDS, NO_OVERLAYS } from './widget-kit.constants';
import type { KitMenuState, KitStatus, KitView, WidgetKitDef } from './widget-kit.type';

const sorted = <T extends { label: string; order?: number }>(items: readonly T[]): T[] =>
  items.map((item) => ({ item, order: item.order ?? UNORDERED, label: item.label })).sort(byOrder).map(({ item }) => item);

const partEntries = (kit: WidgetKitDef, state: KitMenuState, view: KitView | null): MenuEntry[] => {
  const open = state.active === kit.id;
  const members = sorted(kitMembers(kit.id, state.members)).map((def): MenuItem => ({
    key: `${WIDGET_KEY_PREFIX}${def.id}`,
    label: def.label,
    icon: def.icon,
    checked: open && view !== null && isWidgetOpen(view.layout, def.id),
    onClick: () => state.toggleMember(def.id),
  }));
  const overlays = sorted(kit.overlays ?? NO_OVERLAYS).map((overlay): MenuItem => ({
    key: `${KIT_OVERLAY_KEY_PREFIX}${overlay.id}`,
    label: overlay.label,
    icon: KIT_OVERLAY_ICON,
    checked: open && view !== null && !view.hidden.includes(overlay.id),
    disabled: !open,
    onClick: () => state.toggleOverlay(overlay.id),
  }));
  return [...members, ...overlays];
};

const kitEntry = (kit: WidgetKitDef, state: KitMenuState, status: KitStatus): MenuItem => {
  const open = state.active === kit.id;
  return {
    key: `${KIT_KEY_PREFIX}${kit.id}`,
    label: kit.label,
    icon: kit.icon ?? KIT_ICON,
    description: status.reason ?? undefined,
    checked: open,
    children: [
      { key: `${KIT_KEY_PREFIX}${kit.id}-open`, label: open ? KIT_WORDS.close : KIT_WORDS.open, icon: open ? 'x' : KIT_OPEN_ICON, onClick: () => state.toggle(kit.id) },
      'separator',
      ...partEntries(kit, state, kitViewOf(kit.id, state)),
      'separator',
      { key: `${KIT_KEY_PREFIX}${kit.id}-reset`, label: KIT_WORDS.reset, icon: 'rotate-ccw', confirm: true, onClick: () => state.reset(kit.id) },
    ],
  };
};

const buildKitMenuEntries = (state: KitMenuState, statusOf: (kit: WidgetKitDef) => KitStatus): MenuItem[] =>
  sorted(state.kits).flatMap((kit) => {
    const status = statusOf(kit);
    return status.shown ? [kitEntry(kit, state, status)] : [];
  });

export { buildKitMenuEntries };
