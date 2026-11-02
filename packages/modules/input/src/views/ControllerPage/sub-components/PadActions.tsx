/* @layer renderer-components @kind component */
import { useCallback } from 'react';
import { Icon as IconifyIcon } from '@iconify/react/offline';
import stethoscopeIcon from '@iconify-icons/lucide/stethoscope';
import { IconButton } from '@drizztdourden08/tessera/primitives';
import { otherPadActions } from '../../../renderer/other-pad-actions';
import { useReportAction } from '../../../renderer/useReportAction';
import { useShownPadActions } from '../behavior/useShownPadActions';
import { DIAGNOSE_AND_REPORT_LABEL, RUN_DIAGNOSTICS_LABEL } from '../ControllerPage.constants';
import type { PadActionsProps } from '../ControllerPage.type';
import { PadActionButton } from './PadActionButton';

const PadActions = ({ entry, onRunDiagnostics }: PadActionsProps) => {
  const { deviceKey } = entry;
  const runDiagnostics = useCallback(() => onRunDiagnostics?.(deviceKey), [onRunDiagnostics, deviceKey]);
  const registered = useShownPadActions(entry);
  const report = useReportAction(entry);
  const merged = onRunDiagnostics !== undefined && report !== null;
  const shown = onRunDiagnostics ? otherPadActions(registered) : registered;
  const label = merged ? DIAGNOSE_AND_REPORT_LABEL : RUN_DIAGNOSTICS_LABEL;

  return (
    <>
      {onRunDiagnostics && (
        <IconButton variant="ghost" size="xs" label={label} title={label} onClick={runDiagnostics}>
          <IconifyIcon icon={stethoscopeIcon} width={14} height={14} />
        </IconButton>
      )}
      {shown.map(({ action, disabled }) => (
        <PadActionButton key={action.id} action={action} disabled={disabled} entry={entry} />
      ))}
    </>
  );
};

export { PadActions };
