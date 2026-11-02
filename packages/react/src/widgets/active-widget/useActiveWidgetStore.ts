/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { ActiveWidgetState } from './active-widget.type';

const useActiveWidgetStore = create<ActiveWidgetState>()(() => ({ id: null, verify: true }));

export { useActiveWidgetStore };
