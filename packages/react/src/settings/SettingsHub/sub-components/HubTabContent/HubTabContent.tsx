/* @layer renderer-shell @kind component */
import { useContext, useMemo } from 'react';
import { SettingsPage } from '@drizztdourden08/tessera/composites';
import { tabSectionDefs } from '../../../tab-section-defs';
import { SettingsPageContext } from '../../../SettingsLayout/behavior/settings-page-context';
import { SettingsLayout } from '../../../SettingsLayout/SettingsLayout';
import type { HubTabContentProps } from './HubTabContent.type';

const HubTabContent = <S extends object>(props: HubTabContentProps<S>) => {
  const { tab, ...control } = props;
  const page = useContext(SettingsPageContext);
  const sections = useMemo(() => tabSectionDefs(tab, control.settings), [tab, control.settings]);
  if (tab.render && page?.variant === 'page') {
    return <SettingsPage icon={page.icon} title={page.title} backdrop={page.backdrop}>{tab.render({ tab, ...control })}</SettingsPage>;
  }
  if (tab.render) return <>{tab.render({ tab, ...control })}</>;
  return <SettingsLayout sections={sections} preview={tab.preview?.(control.settings)} previewPlacement={tab.previewPlacement} previewLabel={tab.previewLabel} {...control} />;
};

export { HubTabContent };
