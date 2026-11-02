/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import { getPlatform } from '../../../platform/get-platform';
import type { DocumentFolderFieldProps, FolderFieldState } from '../DocumentFolderField.type';
import { useFolderCheck } from './useFolderCheck';

const useFolderField = ({ value, roots = [] }: DocumentFolderFieldProps): FolderFieldState => {
  const reason = useFolderCheck(value);
  const start = value ?? roots[0];

  const browse = useCallback(
    async (): Promise<string | null> => (await getPlatform().documents?.openFolder(start === undefined ? {} : { defaultPath: start })) ?? null,
    [start],
  );
  const rootOptions = useMemo(() => roots.map((path) => ({ value: path, label: path })), [roots]);

  return { reason, browse, rootOptions, rootValue: value !== null && roots.includes(value) ? value : null };
};

export { useFolderField };
