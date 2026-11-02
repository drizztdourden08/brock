/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { act, createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createToolbarLayout, isToolbarShown, isWidgetOpen } from '@drizztdourden08/tessera/composites';
import { defineToolbar } from '../src/toolbars/define-toolbar';
import { useToolbarLayoutStore } from '../src/toolbars/useToolbarLayoutStore';
import { defineWidget } from '../src/widgets/define-widget';
import { focusKeep } from '../src/widgets/focus-keep';
import { forgetFocusMode } from '../src/widgets/forget-focus-mode';
import { layout } from '../src/widgets/layout-facade';
import { useFocusMode } from '../src/widgets/useFocusMode';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';
import { widgetMainRect } from '../src/widgets/widget-main-rect';
import { widgets } from '../src/widgets/widgets';
import { showHarness } from './show-harness';
import { resetWidgetStage } from './widget-stage-fixture';

const make = (id: string) => defineWidget({ id, label: id.toUpperCase(), render: () => null });
const DEFINITIONS = [make('multi'), make('plain')];
const store = () => useWidgetLayoutStore.getState();

beforeEach(() => {
  resetWidgetStage(DEFINITIONS);
  forgetFocusMode();
  focusKeep({});
});

afterEach(() => {
  widgetMainRect.current = null;
  showHarness.resetShow();
});

describe('S1 layout.focusKeep and useFocusMode', { tags: ['standard'] }, () => {
  const BARS = [
    defineToolbar({ id: 'tools', label: 'Tools', defaultSide: 'left', render: () => null }),
    defineToolbar({ id: 'status', label: 'Status', defaultSide: 'bottom', render: () => null }),
  ];
  const Probe = () => createElement('p', null, useFocusMode() ? 'focus' : 'normal');

  beforeEach(() => {
    useToolbarLayoutStore.setState({ definitions: [], layout: createToolbarLayout([]), pending: null });
    useToolbarLayoutStore.getState().setDefinitions(BARS);
  });

  it('keeps the named widget and toolbar open and hides the rest', () => {
    widgets.dock('plain', { side: 'right', size: 300 });
    widgets.dock('multi', { side: 'left', size: 300 });
    layout.focusKeep({ widgets: ['plain'], toolbars: ['status'] });
    layout.focusMode(true);
    expect(isWidgetOpen(store().layout, 'plain')).toBe(true);
    expect(isWidgetOpen(store().layout, 'multi')).toBe(false);
    expect(isToolbarShown(useToolbarLayoutStore.getState().layout, 'status')).toBe(true);
    expect(isToolbarShown(useToolbarLayoutStore.getState().layout, 'tools')).toBe(false);
  });

  it('puts every widget and toolbar back on leaving, kept ones included', () => {
    widgets.dock('plain', { side: 'right', size: 300 });
    widgets.dock('multi', { side: 'left', size: 300 });
    const before = store().layout;
    layout.focusKeep({ widgets: ['plain'] });
    layout.focusMode(true);
    layout.focusMode(false);
    expect(store().layout).toBe(before);
  });

  it('follows focus mode in the hook', () => {
    const host = showHarness.render(createElement(Probe));
    expect(host.textContent).toBe('normal');
    act(() => { layout.focusMode(true); });
    expect(showHarness.render(createElement(Probe)).textContent).toBe('focus');
  });
});
