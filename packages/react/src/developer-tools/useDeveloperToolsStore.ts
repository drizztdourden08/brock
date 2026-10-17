/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { DeveloperToolsState } from './developer-tools.type';

const useDeveloperToolsStore = create<DeveloperToolsState>()(() => ({ binding: null, on: false }));

export { useDeveloperToolsStore };
