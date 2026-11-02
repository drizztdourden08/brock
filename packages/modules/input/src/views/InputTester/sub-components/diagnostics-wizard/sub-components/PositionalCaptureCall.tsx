/* @layer renderer-shell @kind component */
import { Box, Icon, ProgressBar, Text } from '@drizztdourden08/tessera/primitives';
import { callDetailOf } from '../positional-capture/call-detail-of';
import { callHeadlineOf } from '../positional-capture/call-headline-of';
import { callModeOf } from '../positional-capture/call-mode-of';
import { CALL_ICONS, CALL_EYEBROWS } from '../positional-capture/positional-capture.constants';
import type { PositionalCaptureCallProps } from './diagnostics-steps.type';
import './PositionalCaptureCall.css';

const PositionalCaptureCall = (props: PositionalCaptureCallProps) => {
  const { call } = props;
  const mode = callModeOf(call);

  return (
    <Box className="pos-call" data-mode={mode} role="status" aria-live="polite">
      <Box as="span" className="pos-call__icon" aria-hidden="true"><Icon name={CALL_ICONS[mode]} /></Box>
      <Box className="pos-call__text">
        <Text as="span" variant="overline" className="pos-call__eyebrow">{CALL_EYEBROWS[mode]}</Text>
        <Text as="span" className="pos-call__headline">{callHeadlineOf(call)}</Text>
        <Text as="span" className="pos-call__detail">{callDetailOf(call)}</Text>
      </Box>
      <Box className="pos-call__progress">
        <Text as="span" numeric className="pos-call__count">{call.answered} of {call.total}</Text>
        <ProgressBar value={call.answered} max={Math.max(call.total, 1)} tone={mode === 'done' ? 'success' : 'primary'} label="Inputs answered" />
      </Box>
    </Box>
  );
};

export { PositionalCaptureCall };
