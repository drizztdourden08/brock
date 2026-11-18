/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { useLocale, useSettings } from '@drizztdourden08/brock-react';
import { effectiveLocale } from '../../effective-locale';
import { useLocaleChoice } from '../../useLocaleChoice';
import { profileLocaleOf } from './profile-locale-of';

const useProfileLanguage = (): void => {
  const { settings, patch, hydrated } = useSettings<object>();
  const { setLocale } = useLocale();
  const offered = useLocaleChoice((s) => s.app?.offered);
  const wanted = useLocaleChoice(effectiveLocale);
  const profile = hydrated && offered ? profileLocaleOf(settings, offered) : null;

  useEffect(() => {
    useLocaleChoice.getState().setProfile(profile);
  }, [profile]);

  useEffect(() => {
    useLocaleChoice.getState().setPatchProfile((locale) => patch({ locale }));
    return () => useLocaleChoice.getState().setPatchProfile(null);
  }, [patch]);

  useEffect(() => {
    if (wanted) void setLocale(wanted).catch(() => undefined);
  }, [wanted, setLocale]);
};

export { useProfileLanguage };
