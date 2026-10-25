/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { CalibrationResult, DiagnosticsWizard } from '../InputTester';
import type { HidControllerMap } from '../InputTester';
import { useReportHandoff } from './behavior/useReportHandoff';
import { RESULT_TITLE, RUN_LABEL } from './ControllerDiagnostics.constants';
import type { ControllerDiagnosticsProps } from './ControllerDiagnostics.type';
import './ControllerDiagnostics.css';

const ControllerDiagnostics = (props: ControllerDiagnosticsProps) => {
  const { initialDeviceKey } = props;
  const preselected = Boolean(initialDeviceKey);
  const [running, setRunning] = useState(true);
  const [lastResult, setLastResult] = useState<HidControllerMap | null>(null);
  const handoff = useReportHandoff(preselected ? initialDeviceKey ?? null : null);
  const start = useCallback(() => setRunning(true), []);
  const stop = useCallback(() => setRunning(false), []);

  return (
    <Box className="controller-diagnostics">
      {running
        ? (
          <DiagnosticsWizard
            initialDeviceKey={initialDeviceKey}
            preselected={preselected}
            onComplete={setLastResult}
            onClose={stop}
            onReport={handoff?.send}
            reportLook={handoff?.look}
          />
        )
        : <Box className="controller-diagnostics__idle"><Button variant="primary" onClick={start}>{RUN_LABEL}</Button></Box>}
      {lastResult && (
        <Box className="controller-diagnostics__result">
          <Text className="controller-diagnostics__label">{RESULT_TITLE}</Text>
          <CalibrationResult calibration={lastResult} />
        </Box>
      )}
    </Box>
  );
};

export { ControllerDiagnostics };
