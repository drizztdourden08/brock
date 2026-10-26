/* @layer renderer-shell @kind component */
import { useCallback, useContext, useMemo } from 'react';
import { SettingsPage, SettingsSection } from '@drizztdourden08/tessera/composites';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { EmptyState, useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import { readSource } from '../read-source';
import type { SettingItem, SettingsLayoutProps } from '../settings.type';
import type { ResolvedSection } from './SettingsLayout.type';
import { groupListSections } from './behavior/group-list-sections';
import { resolveSections } from './behavior/resolve-sections';
import { settingRows } from './behavior/setting-rows';
import { sourcePatch } from './behavior/source-patch';
import { useActionRunner } from './behavior/useActionRunner';
import { useSourceRefresh } from './behavior/useSourceRefresh';
import { SettingsPageContext } from './behavior/settings-page-context';
import { SettingsPreviewLayout } from './sub-components/SettingsPreviewLayout';

const SettingsLayout = <S extends object>(props: SettingsLayoutProps<S>) => {
  const { sections, settings, defaults, onChange, renderControl, isDisabled, lockCauseOf, lockOverlay, emptyMessage, preview, previewPlacement } = props;
  const page = useContext(SettingsPageContext);
  const { panels } = useTesseraStrings();
  const query = page?.variant === 'results' ? page.query : '';

  const runner = useActionRunner();
  const sources = useMemo(() => [...new Set(sections.flatMap((section) => (section.source ? [section.source] : [])))], [sections]);
  const { version, refresh } = useSourceRefresh(sources);
  const lockOf = useCallback((key: string) => lockCauseOf?.(key, settings) ?? null, [lockCauseOf, settings]);
  const resolved = useMemo(() => resolveSections(sections, query, settings), [sections, query, settings, version]);
  const anchors = useMemo(() => resolved.map((s) => ({ id: s.id, label: s.title })), [resolved]);

  const rowsOf = (item: SettingItem, section: ResolvedSection): SettingsSectionRow[] => {
    const { source } = section;
    const values = source ? readSource(source, section.groups.flatMap((group) => group.items.map((entry) => entry.key))) as S : settings;
    const patch = source ? sourcePatch<S>(source, refresh) : onChange;
    const lock = source ? (lockCauseOf?.(item.key, values) ?? null) : lockOf(item.key);
    return settingRows(item, { settings: values, onChange: patch, renderControl, disabled: isDisabled?.(item.key, values) ?? false, lock, runner });
  };

  const listed = groupListSections({ sections: resolved, settings, defaults, onChange, lockOf, rowsOf });
  const body = listed.length === 0
    ? <EmptyState message={emptyMessage ?? panels.settingsEmpty} />
    : (
      <>
        {listed.map((section) => <SettingsSection key={section.id} {...section} renderLock={lockOverlay} />)}
      </>
    );

  if (page?.variant === 'results') return resolved.length > 0 ? body : null;
  const framed = <SettingsPreviewLayout preview={preview} placement={previewPlacement}>{body}</SettingsPreviewLayout>;
  if (!page) return framed;
  return (
    <SettingsPage icon={page.icon} title={page.title} backdrop={page.backdrop} anchors={anchors}>
      {framed}
    </SettingsPage>
  );
};

export { SettingsLayout };
