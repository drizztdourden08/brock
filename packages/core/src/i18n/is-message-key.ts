/* @layer core @kind logic */
import { MESSAGE_KEY_SHAPE } from './message-key.constants';
import type { MessageKey } from './message-key.type';

const isMessageKey = (key: string): key is MessageKey => MESSAGE_KEY_SHAPE.test(key);

export { isMessageKey };
