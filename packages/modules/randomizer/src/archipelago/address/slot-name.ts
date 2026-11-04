/* @layer core @kind logic */
import { slotNameError } from './slot-name-error';

const isValidSlotName = (name: string): boolean => name !== '' && slotNameError(name) === null;

export { isValidSlotName };
