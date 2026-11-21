/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { Select } from '@drizztdourden08/tessera/primitives';
import type { VersionPickerProps } from '../UpdateDialog.type';

const VersionPicker = (props: VersionPickerProps) => {
  const { groups, selected, onSelect, allowPrerelease, onAllowPrerelease, disabled } = props;
  const text = useText();

  const rows = useMemo<SettingsSectionRow[]>(() => [
    {
      id: 'allowPrerelease',
      title: text(msg('updater:picker.prerelease.title')),
      description: text(msg('updater:picker.prerelease.description')),
      hint: text(msg('updater:picker.prerelease.hint')),
      disabled,
      input: { kind: 'toggle', value: allowPrerelease, onChange: onAllowPrerelease },
    },
    {
      id: 'version',
      title: text(msg('updater:picker.version.title')),
      description: text(msg('updater:picker.version.description')),
      hint: text(msg('updater:picker.version.hint')),
      disabled,
      input: {
        kind: 'custom',
        control: (
          <Select
            value={selected}
            onChange={onSelect}
            groups={groups}
            disabled={disabled}
            size="sm"
            aria-label={text(msg('updater:picker.version.title'))}
          />
        ),
      },
    },
  ], [text, groups, selected, onSelect, allowPrerelease, onAllowPrerelease, disabled]);

  return <SettingsSection rows={rows} />;
};

export { VersionPicker };
