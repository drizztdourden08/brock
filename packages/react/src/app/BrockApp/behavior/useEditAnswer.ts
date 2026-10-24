/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { runEditRole } from '../../../commands/run-edit-role';
import { hostApi } from '../../../host/host-api';
import { useNavigationStore } from '../../../navigation/useNavigationStore';

const useEditAnswer = (base: string | null): void => {
  useEffect(() => {
    const api = hostApi();
    if (!api) return undefined;
    return api.answer('command:runEdit', (role) => runEditRole(role, useNavigationStore.getState().active ?? base));
  }, [base]);
};

export { useEditAnswer };
