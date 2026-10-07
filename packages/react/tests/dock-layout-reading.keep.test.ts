/* @layer renderer-shell @kind test */
// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { GAP, MAIN_NODE, createPane, layoutTree, mainRectOf } from '@drizztdourden08/tessera/composites';
import type { LayoutNode, WidgetLayout } from '@drizztdourden08/tessera/composites';
import { mainViewRect } from '../src/widgets/main-view-rect';
import { useWidgetLayoutStore } from '../src/widgets/useWidgetLayoutStore';

const STAGE = { x: 0, y: 32, width: 1200, height: 800 };

const stageAt = (box: typeof STAGE): void => {
  document.body.innerHTML = '<div class="dock-layout"></div>';
  const stage = document.querySelector('.dock-layout') as HTMLElement;
  stage.getBoundingClientRect = () => ({ ...box, top: box.y, left: box.x, right: box.x + box.width, bottom: box.y + box.height, toJSON: () => box });
};

const withDock = (dock: LayoutNode): WidgetLayout => ({ ...useWidgetLayoutStore.getState().layout, dock });

const overlayRight = (): LayoutNode => ({ kind: 'split', axis: 'row', sizes: [880, 320], children: [MAIN_NODE, createPane(['logs'], false)] });

afterEach(() => document.body.replaceChildren());

describe('the main view rect readDockLayout returns', () => {
  it('is in window terms, like the widget rects: offset by the dock below the title bar', () => {
    stageAt(STAGE);
    const main = mainViewRect(withDock(MAIN_NODE));
    expect(main).toEqual({ x: GAP, y: STAGE.y + GAP, width: STAGE.width - GAP * 2, height: STAGE.height - GAP * 2 });
  });

  it('is the main view alone, without a neighbouring pane that does not make room', () => {
    stageAt(STAGE);
    const dock = overlayRight();
    const inner = { x: GAP, y: GAP, width: STAGE.width - GAP * 2, height: STAGE.height - GAP * 2 };
    const laid = layoutTree(dock, inner);
    const pane = laid.leaves.find((leaf) => leaf.node.kind === 'pane')?.rect;
    expect(mainRectOf(laid)?.width).toBe(inner.width);
    const main = mainViewRect(withDock(dock));
    expect(main?.y).toBe(STAGE.y + GAP);
    expect((main?.x ?? 0) + (main?.width ?? 0)).toBeLessThanOrEqual(STAGE.x + (pane?.x ?? 0));
  });

  it('is null while no dock is drawn', () => {
    expect(mainViewRect(withDock(MAIN_NODE))).toBeNull();
  });
});
