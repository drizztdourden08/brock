/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import type { LocaleChoiceState } from './locale-choice.type';

const useLocaleChoice = create<LocaleChoiceState>()((set) => ({
  app: null,
  profile: null,
  patchProfile: null,
  setApp: (app) => set({ app }),
  setProfile: (profile) => set({ profile }),
  setPatchProfile: (patchProfile) => set({ patchProfile }),
}));

export { useLocaleChoice };
