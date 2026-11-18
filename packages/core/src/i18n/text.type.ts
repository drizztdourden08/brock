/* @layer core @kind types */
import type { MessageKey } from './message-key.type';
import type { MessageValues } from './message-values.type';

type Message = { readonly key: MessageKey; readonly values?: MessageValues };

type Text = string | Message;

export type { Message, Text };
