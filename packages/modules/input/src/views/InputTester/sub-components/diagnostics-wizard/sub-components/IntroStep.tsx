/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import type { IntroStepProps } from './diagnostics-steps.type';
import { HoldStatusLine } from './HoldStatusLine';

const IntroStep = (props: IntroStepProps) => {
  const { releaseStatus } = props;

  return (
    <>
      <Text as="p">Captures every input twice: raw bytes, then by position.</Text>
      <HoldStatusLine
        status={releaseStatus}
        pendingText="Pausing your controllers in the app..."
        doneText="Your controllers are paused in the app while the capture runs."
        errorText="Could not pause your controllers. Byte capture may stay empty."
      />
    </>
  );
};

export { IntroStep };
