/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import type { DiagnosticsRunResult } from '../../../renderer/diagnostics-run-result.type';
import { useReportAction } from '../../../renderer/useReportAction';
import type { FinishLook } from '../../InputTester/sub-components/diagnostics-wizard/diagnostics-wizard.type';
import { REPORT_ICON } from '../ControllerDiagnostics.constants';
import type { ReportHandoff } from '../ControllerDiagnostics.type';
import { useRememberedEntry } from './useRememberedEntry';

const useReportHandoff = (deviceKey: string | null): ReportHandoff | null => {
  const entry = useRememberedEntry(deviceKey);
  const action = useReportAction(entry);

  const look = useMemo((): FinishLook | null => (action ? { label: action.label, icon: action.icon ?? REPORT_ICON } : null), [action]);
  const send = useCallback((result: DiagnosticsRunResult) => {
    const target = result.entry ?? entry;
    if (action && target) void action.onSelect(target, result);
  }, [action, entry]);

  return useMemo(() => (look ? { look, send } : null), [look, send]);
};

export { useReportHandoff };
