/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { normalizeServerUrl, slotNameError } from '../../../../../../archipelago';
import { useOnlineConnection } from '../../../../../online/hooks/behavior/useOnlineConnection';
import type { ServerSetupDraft, ServerSetupForm } from '../ServerSetup.type';
import { draftOf } from './draft-of';

const useServerSetupForm = (): ServerSetupForm => {
  const { connection, patch } = useOnlineConnection();
  const saved = draftOf(connection);
  const [draft, setDraft] = useState<ServerSetupDraft>(saved);
  const slotError = slotNameError(draft.slotName);
  const dirty = draft.serverUrl !== saved.serverUrl || draft.slotName !== saved.slotName || draft.password !== saved.password;
  const canApply = dirty && slotError === null && draft.serverUrl.trim() !== '';
  const set = useCallback((field: keyof ServerSetupDraft, value: string) => setDraft((prev) => ({ ...prev, [field]: value })), []);
  const [applyError, setApplyError] = useState<string | null>(null);
  const apply = useCallback(() => {
    const fields = { serverUrl: normalizeServerUrl(draft.serverUrl), slotName: draft.slotName, password: draft.password };
    void patch(fields).then(setApplyError);
  }, [draft, patch]);

  return { draft, set, slotError, canApply, applyError, apply };
};

export { useServerSetupForm };
