/* @layer renderer-shell @kind component */
import { useCallback, useContext, useMemo } from 'react';
import { Box } from '@drizztdourden08/tessera/primitives';
import type { SettingsLayoutProps } from '../settings.type';
import { SettingsPage } from '../SettingsPage';
import { resolveSections } from './behavior/resolve-sections';
import { SettingsPageContext } from './behavior/settings-page-context';
import { SettingsSections } from './sub-components/SettingsSections';
import './SettingsLayout.css';

const SettingsLayout = <S extends object>(props: SettingsLayoutProps<S>) => {
  const { sections, settings, lockCauseOf, emptyMessage = 'Nothing to set here right now.' } = props;
  const page = useContext(SettingsPageContext);
  const query = page?.variant === 'results' ? page.query : '';

  const lockOf = useCallback((key: string) => lockCauseOf?.(key, settings) ?? null, [lockCauseOf, settings]);
  const resolved = useMemo(() => resolveSections(sections, query), [sections, query]);
  const anchors = useMemo(() => resolved.map((s) => ({ id: s.id, label: s.title })), [resolved]);

  const body = <SettingsSections {...props} sections={resolved} lockOf={lockOf} />;

  if (!page) return body;
  if (page.variant === 'results') return resolved.length > 0 ? body : null;
  return (
    <SettingsPage icon={page.icon} title={page.title} backdrop={page.backdrop} anchors={anchors}>
      {resolved.length > 0 ? body : <Box className="settings-layout__empty">{emptyMessage}</Box>}
    </SettingsPage>
  );
};

export { SettingsLayout };
