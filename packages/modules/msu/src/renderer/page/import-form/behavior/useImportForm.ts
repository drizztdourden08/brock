/* @layer renderer-shell @kind hook */
import { useState, useCallback } from 'react';
import { useT } from '@drizztdourden08/brock-react';
import { useImportProgress } from './useImportProgress';
import { NO_STATUS } from '../ImportForm.constants';
import type { ImportResult, ImportStatus, UseImportFormParams } from '../ImportForm.type';

const statusOf = (result: ImportResult): ImportStatus => ({
  message: result.message,
  variant: result.success ? 'success' : 'error',
});

const useImportForm = (params: UseImportFormParams) => {
  const { kind, disabled, onUrlImport, onFileImport } = params;
  const t = useT();
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ImportStatus>(NO_STATUS);
  const [busy, setBusy] = useState(false);
  const progress = useImportProgress(kind);

  const isDisabled = disabled || busy;

  const handleDownload = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    try { new URL(trimmed); } catch {
      setStatus({ message: t('msu:import.invalidUrl'), variant: 'error' });
      return;
    }
    setBusy(true);
    setStatus({ message: t('msu:import.downloading'), variant: '' });
    try {
      const result = await onUrlImport(trimmed);
      setStatus(statusOf(result));
      if (result.success) setUrl('');
    } catch (e) {
      setStatus({ message: `${e}`, variant: 'error' });
    } finally {
      setBusy(false);
    }
  }, [url, onUrlImport, t]);

  const handleDrop = useCallback(async (files: File[]) => {
    if (files.length === 0) return;
    setBusy(true);
    setStatus({ message: t('msu:import.importing'), variant: '' });
    try {
      setStatus(statusOf(await onFileImport(files)));
    } catch (e) {
      setStatus({ message: `${e}`, variant: 'error' });
    } finally {
      setBusy(false);
    }
  }, [onFileImport, t]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isDisabled) void handleDownload();
  };

  return { url, setUrl, status, busy, progress, isDisabled, handleDownload, handleDrop, handleKeyDown };
};

export { useImportForm };
