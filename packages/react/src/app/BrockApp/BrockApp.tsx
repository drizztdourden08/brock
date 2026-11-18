/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { mergeModules } from '../../modules/merge-modules';
import { I18nProvider } from '../../i18n/I18nProvider';
import { useAppI18n } from '../../i18n/useAppI18n';
import { BrockAppBody } from './sub-components/BrockAppBody';
import { NO_MODULES } from './BrockApp.constants';
import type { BrockAppProps } from './BrockApp.type';
import './BrockApp.css';

const BrockApp = <S extends object>(props: BrockAppProps<S>) => {
  const { modules = NO_MODULES, locales } = props;
  const merged = useMemo(() => mergeModules(modules), [modules]);
  const i18n = useAppI18n(locales, merged.messages, merged.i18n);
  if (!i18n) return null;
  return (
    <I18nProvider i18n={i18n}>
      <BrockAppBody {...props} />
    </I18nProvider>
  );
};

export { BrockApp };
