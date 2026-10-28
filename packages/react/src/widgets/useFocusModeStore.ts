/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { FocusModeState } from './widget.type';

const useFocusModeStore = create<FocusModeState>()(() => ({ on: false, saved: null }));

export { useFocusModeStore };
