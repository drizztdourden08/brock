/* @layer core @kind types */
import type { MessageValue } from '../message-values.type';

type ArgumentFormatter = (value: MessageValue, locale: string, style: string | undefined) => string;

export type { ArgumentFormatter };
