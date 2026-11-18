/* @layer renderer-shell @kind types */
import type { I18nState } from '../i18n.type';

type ProfilePatcher = (locale: string) => void;

interface LocaleChoiceState {
  app: I18nState | null;
  profile: string | null;
  patchProfile: ProfilePatcher | null;
  setApp: (state: I18nState) => void;
  setProfile: (tag: string | null) => void;
  setPatchProfile: (patcher: ProfilePatcher | null) => void;
}

export type { LocaleChoiceState };
