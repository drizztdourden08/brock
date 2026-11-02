/* @layer renderer-shell @kind hook */
import { useEffect, useState } from 'react';
import { getPlatform } from '../../../platform/get-platform';
import { NO_CHECK } from '../DocumentFolderField.constants';
import type { FolderCheck } from '../DocumentFolderField.type';

const reasonOf = (error: unknown): string => (error instanceof Error ? error.message : String(error));

const useFolderCheck = (value: string | null): string | null => {
  const [checked, setChecked] = useState<FolderCheck>(NO_CHECK);

  useEffect(() => {
    const ask = value === null ? undefined : getPlatform().documents?.canWrite;
    if (value === null || ask === undefined) return undefined;
    let current = true;
    const settle = (reason: string | null): void => {
      if (current) setChecked({ path: value, reason });
    };
    ask(value).then((answer) => settle(answer.ok ? null : answer.reason), (error: unknown) => settle(reasonOf(error)));
    return () => {
      current = false;
    };
  }, [value]);

  return value !== null && checked.path === value ? checked.reason : null;
};

export { useFolderCheck };
