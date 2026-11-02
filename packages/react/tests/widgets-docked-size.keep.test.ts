/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { defineWidget } from '../src/widgets/define-widget';
import { widgetMainRect } from '../src/widgets/widget-main-rect';
import { widgets } from '../src/widgets/widgets';
import { resetWidgetStage } from './widget-stage-fixture';

const pane = (id: string) => defineWidget({ id, label: id, render: () => null });
const widthOf = (id: string) => widgets.list().find((each) => each.id === id)?.size;

beforeEach(() => {
  resetWidgetStage([pane('a'), pane('b')]);
});

afterEach(() => {
  widgetMainRect.current = null;
});

describe('K1 docked sizes with a widget on each side', { tags: ['critical'] }, () => {
  it('sets the right side to 300 px with a widget on the left, and keeps the left width', () => {
    widgets.dock('a', { side: 'left', size: 260 });
    widgets.dock('b', { side: 'right', size: 120 });
    expect(widgets.resize('b', 300)).toEqual({ size: 300, reason: null });
    expect(widthOf('b')).toBe(300);
    expect(widthOf('a')).toBe(260);
    expect(widgets.resize('a', 340)).toEqual({ size: 340, reason: null });
    expect(widthOf('a')).toBe(340);
    expect(widthOf('b')).toBe(300);
  });

  it('reports the clamp and the width it used when the edge cannot take the size', () => {
    widgets.dock('a', { side: 'left', size: 200 });
    const result = widgets.resize('a', 5000);
    expect(result.size).toBe(widthOf('a'));
    expect(result.size).toBeLessThan(5000);
    expect(result.reason).toMatch(/5000 px is more than/);
    expect(widgets.resize('a', 1).reason).toMatch(/1 px is less than/);
  });
});
