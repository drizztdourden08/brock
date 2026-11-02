/* @layer renderer-shell @kind hook */
import { useCallback } from 'react';
import { useFlashStatus } from '../../hid-calibration/hooks/useFlashStatus';
import type { DiagnosticsWizardState } from '../diagnostics-wizard.type';
import { useSummaryExport } from './useSummaryExport';

const useSummaryHandlers = (wizard: DiagnosticsWizardState) => {
  const { handleCopyJson, handleSaveToDisk } = useSummaryExport(wizard.byteCapture, wizard.positionalRecords);
  const [copyStatus, flashCopy] = useFlashStatus();
  const [saveStatus, flashSave] = useFlashStatus();
  const handleSave = useCallback(() => { void handleSaveToDisk().then(flashSave); }, [handleSaveToDisk, flashSave]);
  const handleCopy = useCallback(() => { void handleCopyJson().then(flashCopy); }, [handleCopyJson, flashCopy]);
  return { copyStatus, saveStatus, handleSave, handleCopy };
};

export { useSummaryHandlers };
