/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import type { SettingsSectionRow } from '@drizztdourden08/tessera/composites';
import { Select } from '@drizztdourden08/tessera/primitives';
import type { VersionPickerProps } from '../UpdateDialog.type';

const VersionPicker = (props: VersionPickerProps) => {
  const { groups, selected, onSelect, allowPrerelease, onAllowPrerelease, disabled } = props;

  const rows = useMemo<SettingsSectionRow[]>(() => [
    {
      id: 'allowPrerelease',
      title: 'Include pre-releases',
      description: 'List the test builds next to the stable ones.',
      hint: 'On, the version list adds pre-releases. They come out before the usual testing.',
      disabled,
      input: { kind: 'toggle', value: allowPrerelease, onChange: onAllowPrerelease },
    },
    {
      id: 'version',
      title: 'Version to install',
      description: 'The newest version, or an earlier one to go back to.',
      hint: 'Pick a version. An earlier one replaces this build, and its release notes show below.',
      disabled,
      input: {
        kind: 'custom',
        control: <Select value={selected} onChange={onSelect} groups={groups} disabled={disabled} size="sm" aria-label="Version to install" />,
      },
    },
  ], [groups, selected, onSelect, allowPrerelease, onAllowPrerelease, disabled]);

  return <SettingsSection rows={rows} />;
};

export { VersionPicker };
