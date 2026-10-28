/* @layer renderer-shell @kind test */
import { INITIAL_CONTEXTS } from '../src/contexts/contexts.constants';
import { useContextsStore } from '../src/contexts/useContextsStore';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgetMainRect } from '../src/widgets/widget-main-rect';
import type { WidgetDef } from '../src/widgets/widget.type';

const STAGE_RECT = { x: 0, y: 0, width: 1000, height: 600 };

const resetWidgetStage = (definitions: readonly WidgetDef[]): void => {
  widgetMainRect.current = STAGE_RECT;
  useWidgetLayoutStore.getState().setPreset(null);
  useWidgetLayoutStore.getState().replace(null);
  useWidgetLayoutStore.getState().setDefinitions(definitions);
  useContextsStore.setState({ contexts: INITIAL_CONTEXTS });
};

export { resetWidgetStage };
