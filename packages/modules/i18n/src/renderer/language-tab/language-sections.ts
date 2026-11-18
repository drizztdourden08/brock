/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { LocaleSource, SectionDef, SettingChoiceDef } from '@drizztdourden08/brock-react';
import type { I18nState } from '../../i18n.type';
import { APP_KEY, PROFILE_KEY } from '../i18n-renderer.constants';
import { effectiveLocale } from '../effective-locale';
import { useLocaleChoice } from '../useLocaleChoice';
import { appLanguageSource } from './app-language-source';
import { languageKeywords } from './language-keywords';
import { appLanguageOptions, profileLanguageOptions } from './language-options';
import { profileLanguageSource } from './profile-language-source';

const select = (options: SettingChoiceDef[]) => ({ kind: 'select', options, searchable: true }) as const;

const appSection = (state: I18nState, current: string, source: LocaleSource): SectionDef => ({
  id: 'app',
  title: msg('i18n:section.app.title'),
  source: appLanguageSource(source),
  items: [{
    key: APP_KEY,
    label: msg('i18n:row.appLocale.label'),
    description: msg('i18n:row.appLocale.description'),
    keywords: languageKeywords(state),
    control: select(appLanguageOptions(state, current)),
  }],
});

const profileSection = (state: I18nState, current: string): SectionDef => ({
  id: 'profile',
  title: msg('i18n:section.profile.title'),
  source: profileLanguageSource(),
  items: [{
    key: PROFILE_KEY,
    label: msg('i18n:row.locale.label'),
    description: msg('i18n:row.locale.description'),
    keywords: languageKeywords(state),
    control: select(profileLanguageOptions(state, current)),
  }],
});

const languageSections = (source: LocaleSource): SectionDef[] => {
  const choice = useLocaleChoice.getState();
  const { app } = choice;
  if (!app) return [];
  const current = effectiveLocale(choice) ?? app.locale;
  return [appSection(app, current, source), profileSection(app, current)];
};

export { languageSections };
