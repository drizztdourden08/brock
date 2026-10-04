/* @layer electron-main @kind test */
import { captureResize } from '../../src/main/widgets/capture-resize';
import { manipulationRules } from '../../src/main/widgets/manipulation-rules';
import { planResize } from '../../src/main/widgets/plan-resize';
import { resizeEdges } from '../../src/main/widgets/resize-edges';
import { NO_ASPECT_LOCK } from '../../src/main/window/aspect-lock.constants';
import type { ManipulationRules, ResizeStep } from '../../src/main/widgets/widget-windows.type';
import type { AspectLock } from '../../src/main/window/aspect-lock.type';
import type { Rect } from './window-sim.type';

interface PlanDrag {
  first?: Rect;
  from: Rect;
  to: Rect;
  edge: string;
}

interface PlanOptions {
  lock?: AspectLock;
  rules?: ManipulationRules;
  min?: { width: number; height: number };
}

const MIN = { width: 240, height: 160 };

const planStep = (id: string, drag: PlanDrag, others: readonly { id: string; bounds: Rect }[], options: PlanOptions = {}): ResizeStep => {
  const lock = options.lock ?? NO_ASPECT_LOCK;
  const min = options.min ?? MIN;
  const session = captureResize({
    id, edge: drag.edge, sides: resizeEdges(drag.from, drag.from, drag.edge), known: true, start: drag.from, first: drag.first ?? drag.from, min, locked: id === 'main' && lock.ratio > 0,
    others: others.map((other) => ({ ...other, min, canFollow: !(other.id === 'main' && lock.ratio > 0) })),
  });
  return planResize(session, { proposed: drag.to, rules: options.rules ?? manipulationRules(false, true), lock });
};

const same = (a: Rect, b: Rect): boolean => a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;

const changed = (step: ResizeStep, before: readonly { id: string; bounds: Rect }[]): ResizeStep['moves'] =>
  step.moves.filter((move) => !before.some((other) => other.id === move.id && same(other.bounds, move.bounds)));

export { changed, planStep };
