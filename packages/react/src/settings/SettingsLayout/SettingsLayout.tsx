/* @layer renderer-shell @kind component */
import { useCallback, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { SettingsGroupList, SettingsPage } from '@drizztdourden08/tessera/composites';
import type { SettingItem, SettingsLayoutProps } from '../settings.type';
import { groupListSections } from './behavior/group-list-sections';
import { resolveSections } from './behavior/resolve-sections';
import { SettingsPageContext } from './behavior/settings-page-context';
import { DefaultControl } from './sub-components/DefaultControl';

const SettingsLayout = <S extends object>(props: SettingsLayoutProps<S>) => {
  const { sections, settings, defaults, onChange, renderControl, isDisabled, lockCauseOf, lockOverlay, emptyMessage } = props;
  const page = useContext(SettingsPageContext);
  const query = page?.variant === 'results' ? page.query : '';

  const lockOf = useCallback((key: string) => lockCauseOf?.(key, settings) ?? null, [lockCauseOf, settings]);
  const resolved = useMemo(() => resolveSections(sections, query), [sections, query]);
  const anchors = useMemo(() => resolved.map((s) => ({ id: s.id, label: s.title })), [resolved]);

  const renderRow = (item: SettingItem): ReactNode => renderControl?.(item.key, settings, onChange) ?? (
    <DefaultControl
      item={item}
      value={(settings as Record<string, unknown>)[item.key]}
      disabled={isDisabled?.(item.key, settings) ?? false}
      onChange={(next) => onChange({ [item.key]: next } as Partial<S>)}
    />
  );

  const listed = groupListSections({ sections: resolved, settings, defaults, onChange, lockOf, renderRow });
  const body = <SettingsGroupList sections={listed} renderLock={lockOverlay} emptyMessage={emptyMessage} />;

  if (!page) return body;
  if (page.variant === 'results') return resolved.length > 0 ? body : null;
  return (
    <SettingsPage icon={page.icon} title={page.title} backdrop={page.backdrop} anchors={anchors}>
      {body}
    </SettingsPage>
  );
};

export { SettingsLayout };
