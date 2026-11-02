/* @layer renderer-shell @kind logic */
import type { DiagnosticsRunResult } from '../../../../../renderer/diagnostics-run-result.type';
import type { RunResultSource } from '../diagnostics-wizard.type';

const diagnosticsRunResultOf = (wizard: RunResultSource): DiagnosticsRunResult | null => {
  if (wizard.deviceKey === null) return null;
  return {
    deviceKey: wizard.deviceKey,
    entry: wizard.capturedLayout?.entry ?? null,
    mapping: wizard.mapping,
    byteCapture: wizard.byteCapture,
    positionalRecords: wizard.positionalRecords,
  };
};

export { diagnosticsRunResultOf };
