/* @layer renderer-shell @kind test */
import { defineLayoutPreset } from '../src/widgets/define-layout-preset';
import { defineWidget } from '../src/widgets/define-widget';
import { presetLayout } from '../src/widgets/preset-layout';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgets } from '../src/widgets/widgets';

const store = () => useWidgetLayoutStore.getState();

export { defineLayoutPreset, defineWidget, presetLayout, store, widgets };
