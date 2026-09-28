/* @layer renderer-shell @kind component */
import { Box, Select, Text, Toggle } from '@drizztdourden08/tessera/primitives';
import type { VersionPickerProps } from '../UpdateDialog.type';

const VersionPicker = (props: VersionPickerProps) => {
  const { groups, selected, onSelect, allowPrerelease, onAllowPrerelease, disabled } = props;

  return (
    <>
      <Box className="update-dialog__prefs">
        <Toggle
          checked={allowPrerelease}
          onChange={onAllowPrerelease}
          disabled={disabled}
          label="Include pre-releases"
        />
      </Box>
      <Box className="update-dialog__picker">
        <Text className="update-dialog__picker-label">Version to install</Text>
        <Select
          value={selected}
          onChange={onSelect}
          groups={groups}
          disabled={disabled}
          size="sm"
          aria-label="Version to install"
        />
      </Box>
    </>
  );
};

export { VersionPicker };
