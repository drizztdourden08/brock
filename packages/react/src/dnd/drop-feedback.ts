/* @layer renderer-shell @kind logic */
import { DROP_ATTRIBUTE } from './dnd.constants';
import type { DropPhase } from './dnd.type';
import type { Hover, Probe } from './target-entry.type';

const mark = (hover: Hover, phase: DropPhase): void => {
  const { element } = hover.entry;
  if (phase === 'enter' || phase === 'over') element.setAttribute(DROP_ATTRIBUTE, hover.accepted ? 'over' : 'reject');
  else element.removeAttribute(DROP_ATTRIBUTE);
};

const sendFeedback = (hover: Hover, phase: DropPhase, probe: Probe): void => {
  mark(hover, phase);
  hover.entry.options.feedback?.({ phase, accepted: hover.accepted, type: probe.type, payload: probe.payload, point: probe.point, index: hover.index });
};

export { sendFeedback };
