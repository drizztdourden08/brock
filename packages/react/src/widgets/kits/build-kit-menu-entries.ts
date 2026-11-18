/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { fallbackText } from '../../i18n/fallback-text';
import type { MenuEntry, MenuItem } from '../../menu/menu.type';
import { byOrder } from '../../screens/conventions/by-order';
import { UNORDERED } from '../../screens/conventions/screens.constants';
import { menuPlacementOf } from '../menu-placement-of';
import { WIDGET_KEY_PREFIX } from '../widget.constants';
import { kitMembers } from './kit-members';
import { kitViewOf } from './kit-view-of';
import { KIT_ICON, KIT_KEY_PREFIX, KIT_OPEN_ICON, KIT_OVERLAY_ICON, KIT_OVERLAY_KEY_PREFIX, KIT_WORDS, NO_OVERLAYS } from './widget-kit.constants';
import type { KitMenuState, KitStatus, KitView, WidgetKitDef } from './widget-kit.type';
import { widgetLabelOf } from '../widget-label-of';

const sorted = <T extends { order?: number }>(items: readonly T[], labelOf: (item: T) => Text, text: (value: Text) => string): T[] =>
  items.map((item) => ({ item, order: item.order ?? UNORDERED, label: text(labelOf(item)) })).sort(byOrder).map(({ item }) => item);

const partEntries = (kit: WidgetKitDef, state: KitMenuState, view: KitView | null, text: (value: Text) => string): MenuEntry[] => {
  const open = state.active === kit.id;
  const members = sorted(kitMembers(kit.id, state.members), widgetLabelOf, text).map((def): MenuItem => ({
    key: `${WIDGET_KEY_PREFIX}${def.id}`,
    label: text(widgetLabelOf(def)),
    icon: def.icon,
    checked: open && view !== null && isWidgetOpen(view.layout, def.id),
    onClick: () => state.toggleMember(def.id),
  }));
  const overlays = sorted(kit.overlays ?? NO_OVERLAYS, (overlay) => overlay.label, text).map((overlay): MenuItem => ({
    key: `${KIT_OVERLAY_KEY_PREFIX}${overlay.id}`,
    label: text(overlay.label),
    icon: KIT_OVERLAY_ICON,
    checked: open && view !== null && !view.hidden.includes(overlay.id),
    disabled: !open,
    onClick: () => state.toggleOverlay(overlay.id),
  }));
  return [...members, ...overlays];
};

const kitEntry = (kit: WidgetKitDef, state: KitMenuState, status: KitStatus, text: (value: Text) => string): MenuItem => {
  const open = state.active === kit.id;
  return {
    key: `${KIT_KEY_PREFIX}${kit.id}`,
    label: text(kit.label),
    icon: kit.icon ?? KIT_ICON,
    description: status.reason === null ? undefined : text(status.reason),
    ...(kit.devOnly === true ? { devOnly: true } : {}),
    ...menuPlacementOf(kit.menu),
    children: [
      { key: `${KIT_KEY_PREFIX}${kit.id}-open`, label: text(open ? KIT_WORDS.close : KIT_WORDS.open), icon: open ? 'x' : KIT_OPEN_ICON, onClick: () => state.toggle(kit.id) },
      'separator',
      ...partEntries(kit, state, kitViewOf(kit.id, state), text),
      'separator',
      { key: `${KIT_KEY_PREFIX}${kit.id}-reset`, label: text(KIT_WORDS.reset), icon: 'rotate-ccw', confirm: true, onClick: () => state.reset(kit.id) },
    ],
  };
};

const buildKitMenuEntries = (state: KitMenuState, statusOf: (kit: WidgetKitDef) => KitStatus, text: (value: Text) => string = fallbackText): MenuItem[] =>
  sorted(state.kits, (kit) => kit.label, text).flatMap((kit) => {
    const status = statusOf(kit);
    return status.shown ? [kitEntry(kit, state, status, text)] : [];
  });

export { buildKitMenuEntries };
