/* @layer renderer-shell @kind component */
import { useContext, useMemo } from 'react';
import { SettingsPage } from '@drizztdourden08/tessera/composites';
import { SettingsPageContext } from '../../../SettingsLayout/behavior/settings-page-context';
import { SettingsLayout } from '../../../SettingsLayout/SettingsLayout';
import { NO_SECTIONS } from './HubTabContent.constants';
import type { HubTabContentProps } from './HubTabContent.type';

const HubTabContent = <S extends object>(props: HubTabContentProps<S>) => {
  const { tab, ...control } = props;
  const page = useContext(SettingsPageContext);
  const sections = useMemo(() => tab.sections?.(control.settings) ?? NO_SECTIONS, [tab, control.settings]);
  if (tab.render && page?.variant === 'page') {
    return <SettingsPage icon={page.icon} title={page.title} backdrop={page.backdrop}>{tab.render({ tab, ...control })}</SettingsPage>;
  }
  if (tab.render) return <>{tab.render({ tab, ...control })}</>;
  return <SettingsLayout sections={sections} {...control} />;
};

export { HubTabContent };
