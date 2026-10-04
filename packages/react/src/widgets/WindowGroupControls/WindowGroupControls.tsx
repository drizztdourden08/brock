/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Field, Select, Stack, Toggle } from '@drizztdourden08/tessera/primitives';
import { NO_GROUP, WINDOW_GROUP_TEXT } from '../window-groups.constants';
import type { WindowGroupControlsProps } from './WindowGroupControls.type';

const WindowGroupControls = (props: WindowGroupControlsProps) => {
  const { sync, onSyncChange, windowGroup, windowGroups, onWindowGroupChange } = props;
  const options = useMemo(
    () => [{ value: NO_GROUP, label: WINDOW_GROUP_TEXT.none }, ...windowGroups.map((group) => ({ value: group.id, label: group.label }))],
    [windowGroups],
  );

  return (
    <Stack gap="sm" data-window-group-controls="">
      <Toggle label={WINDOW_GROUP_TEXT.sync} description={WINDOW_GROUP_TEXT.syncHint} checked={sync} onChange={onSyncChange} />
      <Field label={WINDOW_GROUP_TEXT.group}>
        <Select
          aria-label={WINDOW_GROUP_TEXT.group}
          options={options}
          value={windowGroup ?? NO_GROUP}
          onChange={(value) => onWindowGroupChange(value === NO_GROUP ? null : value)}
        />
      </Field>
    </Stack>
  );
};

export { WindowGroupControls };
