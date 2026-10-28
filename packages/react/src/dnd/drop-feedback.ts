/* @layer renderer-shell @kind logic */
import { DROP_ATTRIBUTE } from './dnd.constants';
import type { DragPoint, DropPhase } from './dnd.type';
import type { Hover } from './target-entry.type';

const mark = (hover: Hover, phase: DropPhase): void => {
  const { element } = hover.entry;
  if (phase === 'enter' || phase === 'over') element.setAttribute(DROP_ATTRIBUTE, hover.accepted ? 'over' : 'reject');
  else element.removeAttribute(DROP_ATTRIBUTE);
};

const sendFeedback = (hover: Hover, phase: DropPhase, point: DragPoint, type: string, payload: unknown): void => {
  mark(hover, phase);
  hover.entry.options.feedback?.({ phase, accepted: hover.accepted, type, payload, point, index: hover.index });
};

export { sendFeedback };
