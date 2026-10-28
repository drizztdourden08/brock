/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { SettingsLayout } from '../../settings/SettingsLayout';
import { widgetPrefSection } from '../widget-pref-section';
import { NO_SETTINGS } from './WidgetPrefsPanel.constants';
import type { WidgetPrefsPanelProps } from './WidgetPrefsPanel.type';

const ignore = (): void => undefined;

const WidgetPrefsPanel = ({ def }: WidgetPrefsPanelProps) => {
  const sections = useMemo(() => {
    const section = widgetPrefSection(def);
    return section === null ? [] : [{ ...section, title: '' }];
  }, [def]);
  return <SettingsLayout sections={sections} settings={NO_SETTINGS} onChange={ignore} />;
};

export { WidgetPrefsPanel };
