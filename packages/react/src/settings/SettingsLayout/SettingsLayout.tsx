/* @layer renderer-shell @kind component */
import { useCallback, useContext, useMemo } from 'react';
import { SettingsPage, SettingsSection } from '@drizztdourden08/tessera/composites';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { EmptyState, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import type { SettingItem, SettingsLayoutProps } from '../settings.type';
import { groupListSections } from './behavior/group-list-sections';
import { resolveSections } from './behavior/resolve-sections';
import { settingRow } from './behavior/setting-row';
import { SettingsPageContext } from './behavior/settings-page-context';

const SettingsLayout = <S extends object>(props: SettingsLayoutProps<S>) => {
  const { sections, settings, defaults, onChange, renderControl, isDisabled, lockCauseOf, lockOverlay, emptyMessage } = props;
  const page = useContext(SettingsPageContext);
  const { panels } = useTesseraStrings();
  const query = page?.variant === 'results' ? page.query : '';

  const lockOf = useCallback((key: string) => lockCauseOf?.(key, settings) ?? null, [lockCauseOf, settings]);
  const resolved = useMemo(() => resolveSections(sections, query), [sections, query]);
  const anchors = useMemo(() => resolved.map((s) => ({ id: s.id, label: s.title })), [resolved]);

  const rowOf = (item: SettingItem): SettingsSectionRow | null =>
    settingRow(item, { settings, onChange, renderControl, disabled: isDisabled?.(item.key, settings) ?? false, lock: lockOf(item.key) });

  const listed = groupListSections({ sections: resolved, settings, defaults, onChange, lockOf, rowOf });
  const body = listed.length === 0
    ? <EmptyState message={emptyMessage ?? panels.settingsEmpty} />
    : (
      <>
        {listed.map((section) => <SettingsSection key={section.id} {...section} renderLock={lockOverlay} />)}
      </>
    );

  if (!page) return body;
  if (page.variant === 'results') return resolved.length > 0 ? body : null;
  return (
    <SettingsPage icon={page.icon} title={page.title} backdrop={page.backdrop} anchors={anchors}>
      {body}
    </SettingsPage>
  );
};

export { SettingsLayout };
