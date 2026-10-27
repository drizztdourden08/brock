/* @layer renderer-shell @kind types */
import type { WidgetSnapshot } from './widget-snapshot.type';

type DockedFacts = Pick<WidgetSnapshot, 'side' | 'size' | 'index' | 'tab'>;

export type { DockedFacts };
