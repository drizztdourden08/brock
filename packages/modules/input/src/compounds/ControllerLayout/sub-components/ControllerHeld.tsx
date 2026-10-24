/* @layer renderer-shell @kind component */
import { Box } from '@drizztdourden08/tessera/primitives';
import type { ControllerHeldProps } from '../ControllerLayout.type';

const ControllerHeld = (props: ControllerHeldProps) => {
  const { lines, label, empty } = props;

  return (
    <Box as="ul" className="input-controller-layout__held" aria-label={label}>
      {lines.length === 0 ? <Box as="li">{empty}</Box> : lines.map((line, index) => <Box as="li" key={index}>{line}</Box>)}
    </Box>
  );
};

export { ControllerHeld };
