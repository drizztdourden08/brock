/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { FocusModeState } from './widget.type';
import { NO_FOCUS_KEEP } from './widget.constants';

const useFocusModeStore = create<FocusModeState>()(() => ({ on: false, keep: NO_FOCUS_KEEP, saved: null }));

export { useFocusModeStore };
