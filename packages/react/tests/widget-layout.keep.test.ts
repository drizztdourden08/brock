/* @layer renderer-shell @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { isWidgetOpen, placementOf, widgetsIn } from '@drizztdourden08/tessera/composites';
import type { FlatWidgetLayout } from '@drizztdourden08/tessera/composites';
import { dockBack } from '../src/widgets/dock-back';
import { defineWidget } from '../src/widgets/define-widget';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';

const LOGS = defineWidget({ id: 'logs', label: 'Logs', render: () => null, defaultSide: 'bottom', popOut: true });
const NOTES = defineWidget({ id: 'notes', label: 'Notes', render: () => null });
const MAIN = { x: 0, y: 0, width: 1200, height: 800 };

const FLAT: FlatWidgetLayout = {
  widgets: [
    {
      id: 'logs', mode: 'docked', side: 'bottom', order: 0, opacity: 0.8, visibility: 'always', visible: true,
      x: 0, y: 0, width: 640, height: 360, dockedSize: 240, exclusive: true,
    },
    {
      id: 'notes', mode: 'floating', side: 'right', order: 1, opacity: 0.92, visibility: 'always', visible: false,
      x: 40, y: 40, width: 300, height: 200, dockedSize: 320, exclusive: false,
    },
  ],
};

const store = () => useWidgetLayoutStore.getState();

describe('the widget layout store', () => {
  beforeEach(() => {
    store().replace(null);
    store().setDefinitions([LOGS, NOTES]);
  });

  it('migrates a stored flat layout to the split tree on load', () => {
    store().replace(FLAT);
    const { layout } = store();
    expect(layout.v).toBe(2);
    expect(placementOf(layout, 'logs')).toBe('docked');
    expect(isWidgetOpen(layout, 'notes')).toBe(false);
    expect(layout.frame.logs?.opacity).toBe(0.8);
    expect(layout.popped).toEqual([]);
  });

  it('keeps a current layout as it is and starts empty from nothing', () => {
    store().replace(FLAT);
    const current = store().layout;
    store().replace(current);
    expect(store().layout).toBe(current);
    store().replace(undefined);
    expect(widgetsIn(store().layout.dock)).toEqual([]);
  });

  it('opens a widget docked on its default side and toggles it away', () => {
    store().toggle('logs');
    expect(placementOf(store().layout, 'logs')).toBe('docked');
    store().toggle('logs');
    expect(isWidgetOpen(store().layout, 'logs')).toBe(false);
  });

  it('pops out only a widget that declares popOut', () => {
    store().popOut('notes');
    expect(isWidgetOpen(store().layout, 'notes')).toBe(false);
    store().popOut('logs');
    expect(placementOf(store().layout, 'logs')).toBe('popped');
  });
});

describe('dockBack', () => {
  const context = { definitions: [LOGS, NOTES], main: MAIN };
  const popped = () => {
    store().replace(null);
    store().setDefinitions([LOGS, NOTES]);
    store().popOut('logs');
    return store().layout;
  };

  it('docks a widget back on its default side', () => {
    expect(placementOf(dockBack(popped(), 'logs', undefined, context), 'logs')).toBe('docked');
  });

  it('floats it over the main view when asked', () => {
    expect(placementOf(dockBack(popped(), 'logs', 'float', context), 'logs')).toBe('floating');
  });

  it('closes it and remembers its window when asked to close', () => {
    const layout = dockBack(popped(), 'logs', 'close', context);
    expect(isWidgetOpen(layout, 'logs')).toBe(false);
    expect(layout.poppedMemory?.logs?.id).toBe('logs');
  });
});
