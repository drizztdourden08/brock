/* @layer core @kind types */
import type { Direction } from './locale/locale.type';

type State = { locale: string; chain: readonly string[]; dir: Direction };

export type { State };
