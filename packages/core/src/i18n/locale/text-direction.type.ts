/* @layer core @kind types */
import type { Direction } from './locale.type';

type TextInfo = { direction?: Direction };

type LocaleWithInfo = Intl.Locale & { getTextInfo?: () => TextInfo; textInfo?: TextInfo };

export type { TextInfo, LocaleWithInfo };
