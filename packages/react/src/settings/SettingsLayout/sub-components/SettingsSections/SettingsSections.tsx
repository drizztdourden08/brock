/* @layer renderer-shell @kind component */
import type { ReactNode } from 'react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { DisabledOverlay } from '@drizztdourden08/tessera/composites';
import type { LockOverlayProps, SettingItem } from '../../../settings.type';
import { changedKeys } from '../../behavior/changed-keys';
import { defaultsPatch } from '../../behavior/defaults-patch';
import { DefaultControl } from '../DefaultControl';
import { SectionHeading } from '../SectionHeading';
import { SettingsGroup } from '../SettingsGroup';
import type { SettingsSectionsProps } from './SettingsSections.type';

const defaultLockOverlay = ({ cause, children }: LockOverlayProps): ReactNode => (
  <DisabledOverlay active contained message={cause}>{children}</DisabledOverlay>
);

const SettingsSections = <S extends object>(props: SettingsSectionsProps<S>) => {
  const { sections, settings, defaults, onChange, renderControl, isDisabled, lockOf, lockOverlay = defaultLockOverlay } = props;
  const isLocked = (key: string): boolean => lockOf(key) !== null;

  const renderDefault = (item: SettingItem): ReactNode => (
    <DefaultControl
      item={item}
      value={(settings as Record<string, unknown>)[item.key]}
      disabled={isDisabled?.(item.key, settings) ?? false}
      onChange={(next) => onChange({ [item.key]: next } as Partial<S>)}
    />
  );

  const renderRow = (item: SettingItem): ReactNode =>
    renderControl?.(item.key, settings, onChange) ?? renderDefault(item);

  return (
    <Box className="settings-layout__sections">
      {sections.map((section) => {
        const resettable = defaults ? changedKeys(section.groups, settings, defaults, isLocked) : [];
        return (
          <Box key={section.id} className="settings-layout__section" data-section={section.id}>
            {defaults
              ? (
                <SectionHeading
                  title={section.title}
                  changedCount={resettable.length}
                  onReset={() => onChange(defaultsPatch(resettable, settings, defaults))}
                />
              )
              : <Text as="h2" className="settings-layout__section-title">{section.title}</Text>}
            {section.groups.map((group, groupIndex) => (
              <SettingsGroup
                key={group.id ?? groupIndex}
                group={group}
                lockOf={lockOf}
                lockOverlay={lockOverlay}
                renderRow={renderRow}
              />
            ))}
          </Box>
        );
      })}
    </Box>
  );
};

export { SettingsSections };
