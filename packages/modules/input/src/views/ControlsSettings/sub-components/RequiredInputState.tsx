/* @layer renderer-components @kind component */
import { Box, Image, Status } from '@drizztdourden08/tessera/primitives';
import type { RequiredInputStateProps } from './RequiredInputState.type';
import './RequiredInputState.css';

const RequiredInputState = (props: RequiredInputStateProps) => {
  const { iconSrc, connected, connectedLabel, disconnectedLabel } = props;
  return (
    <Box className="required-input-state">
      <Image src={iconSrc} alt="" className="required-input-state__icon" />
      <Status tone={connected ? 'success' : 'danger'} dot>{connected ? connectedLabel : disconnectedLabel}</Status>
    </Box>
  );
};

export { RequiredInputState };
