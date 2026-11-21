/* @layer renderer-components @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { useText } from '@drizztdourden08/brock-react';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { useRumbleTests } from '../behavior/useRumbleTests';
import { NO_RUMBLE_REASON } from '../ControllerPage.constants';
import type { RumbleTestsProps } from '../ControllerPage.type';
import { RumbleTestButton } from './RumbleTestButton';
import './RumbleTests.css';

const RumbleTests = ({ deviceKey, hasRumble }: RumbleTestsProps) => {
  const tests = useRumbleTests();
  const text = useText();
  return (
    <Box className="rumble-tests">
      <Text className="rumble-tests__title">{text(msg('input:rumble.title'))}</Text>
      <Box className="rumble-tests__buttons">
        {tests.map((test) => (
          <RumbleTestButton key={text(test.label)} deviceKey={deviceKey} test={test} disabled={!hasRumble} />
        ))}
      </Box>
      {!hasRumble && <Text className="rumble-tests__reason">{text(NO_RUMBLE_REASON)}</Text>}
    </Box>
  );
};

export { RumbleTests };
