/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ForcedWidgetState } from './widget.type';

const useForcedWidgetStore = create<ForcedWidgetState>()(() => ({ ids: [], pending: [] }));

export { useForcedWidgetStore };
