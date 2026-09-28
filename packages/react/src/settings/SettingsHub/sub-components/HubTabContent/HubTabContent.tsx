/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { SettingsLayout } from '../../../SettingsLayout/SettingsLayout';
import { NO_SECTIONS } from './HubTabContent.constants';
import type { HubTabContentProps } from './HubTabContent.type';

const HubTabContent = <S extends object>(props: HubTabContentProps<S>) => {
  const { tab, ...control } = props;
  const sections = useMemo(() => tab.sections?.(control.settings) ?? NO_SECTIONS, [tab, control.settings]);
  if (tab.render) return <>{tab.render({ tab, ...control })}</>;
  return <SettingsLayout sections={sections} {...control} />;
};

export { HubTabContent };
