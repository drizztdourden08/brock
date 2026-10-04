/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { titleCase } from '../screens/conventions/title-case';
import { defineWidget } from './define-widget';
import type { WidgetDef, WidgetFile } from './widget.type';

const widgetFromFile = ({ id, component, meta = {} }: WidgetFile): WidgetDef => {
  const { settings, label, ...rest } = meta;
  return defineWidget({
    ...rest,
    id,
    label: label ?? titleCase(id),
    render: () => createElement(component),
    ...(settings ? { settings: () => createElement(settings) } : {}),
  });
};

const widgetsFromFiles = (files: readonly WidgetFile[]): WidgetDef[] => files.map(widgetFromFile);

export { widgetsFromFiles };
