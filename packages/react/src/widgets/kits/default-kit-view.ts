/* @layer renderer-shell @kind logic */
import { presetLayout } from '../preset-layout';
import type { WidgetDef } from '../widget.type';
import { kitMembers } from './kit-members';
import type { KitView, WidgetKitDef } from './widget-kit.type';

const defaultKitView = (kit: WidgetKitDef, members: readonly WidgetDef[]): KitView => ({
  layout: presetLayout(kit.layout ?? null, kitMembers(kit.id, members).map((def) => ({ ...def, defaultOpen: def.defaultOpen ?? true }))),
  hidden: [],
});

export { defaultKitView };
