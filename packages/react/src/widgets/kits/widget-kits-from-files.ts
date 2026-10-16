/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { titleCase } from '../../screens/conventions/title-case';
import { defineWidgetKit } from './define-widget-kit';
import type { KitOverlayDef, KitOverlayFile, WidgetKitDef, WidgetKitFiles } from './widget-kit.type';

const overlayFromFile = ({ id, component, meta }: KitOverlayFile): KitOverlayDef => ({
  id,
  label: meta.label ?? titleCase(id),
  ...(meta.order === undefined ? {} : { order: meta.order }),
  render: () => createElement(component),
});

const widgetKitsFromFiles = ({ kits, overlays = [] }: WidgetKitFiles): WidgetKitDef[] =>
  kits.map(({ id, meta = {} }) => defineWidgetKit({
    ...meta,
    id,
    label: meta.label ?? titleCase(id),
    overlays: overlays.filter((file) => file.meta.kit === id).map(overlayFromFile),
  }));

export { widgetKitsFromFiles };
