/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { CommandState } from './command.type';
import { isMacPlatform } from './is-mac-platform';

const useCommandStore = create<CommandState>()(() => ({
  sources: [],
  overrides: {},
  mac: isMacPlatform(),
  persist: null,
}));

export { useCommandStore };
