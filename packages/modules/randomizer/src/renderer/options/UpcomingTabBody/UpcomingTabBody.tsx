/* @layer renderer-shell @kind component */
import { Stack, Text } from '@drizztdourden08/tessera/primitives';
import { groupsOf } from '../behavior/groups-of';
import { OptionGroupList } from '../OptionGroupList';
import type { UpcomingTabBodyProps } from './UpcomingTabBody.type';

const UpcomingTabBody = (props: UpcomingTabBodyProps) => {
  const { title, options, valueOf, readout } = props;
  if (options.length === 0) return <Text variant="caption">{title}</Text>;

  return (
    <Stack gap="md">
      <Text variant="caption">{title}</Text>
      <OptionGroupList groups={groupsOf(options)} valueOf={valueOf} frozen readout={readout} />
    </Stack>
  );
};

export { UpcomingTabBody };
