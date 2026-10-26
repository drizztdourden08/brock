/* @layer renderer-shell @kind logic */
import type { CommandTrigger } from '../../../commands/command.type';
import { pointerGesture } from '../../pointer-gesture';
import { zonesAt } from '../../zones-at';

const refused = (event: MouseEvent): boolean => {
  const { down } = pointerGesture;
  if (down !== null) return !down.allowed || down.release;
  const [first] = zonesAt(event.target);
  return first?.config.shouldOpen?.(event, first.data) === false;
};

const isSwallowed = (event: MouseEvent, trigger: CommandTrigger): boolean => {
  if (trigger === 'longpress') return pointerGesture.press?.fired === true;
  return trigger === 'pointer' && refused(event) && zonesAt(event.target).length > 0;
};

export { isSwallowed };
