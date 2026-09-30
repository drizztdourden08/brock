/* @layer renderer-shell @kind component */
import { Box, Select, Small, Toggle } from '@drizztdourden08/tessera/primitives';
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
        <Small tone="dim">Version to install</Small>
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
