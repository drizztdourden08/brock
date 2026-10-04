/* @layer renderer-shell @kind logic */
import type { PoppedWidgetWire } from '@drizztdourden08/brock-core';
import { poppedEntry } from './popped-entry';

const poppedWire = (id: string): PoppedWidgetWire | null => poppedEntry(id);

export { poppedWire };
