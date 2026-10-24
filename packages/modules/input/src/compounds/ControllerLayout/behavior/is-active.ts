/* @layer renderer-shell @kind logic */
import type { ControllerAnalog } from '../ControllerLayout.type';
import { amountOf } from './amount-of';

const isActive = (state: ControllerAnalog | undefined): boolean => state?.pressed === true || amountOf(state) > 0;

export { isActive };
