/* @layer renderer-shell @kind hook */
import { useCallback, useMemo } from 'react';
import type { RefObject } from 'react';
import type { DndElement } from '../../../dnd';
import { getPlatform } from '../../../platform/get-platform';
import type { DocumentFolderFieldProps, FolderFieldState } from '../DocumentFolderField.type';
import { useFolderCheck } from './useFolderCheck';
import { useFolderDrop } from './useFolderDrop';

const useFolderField = (props: DocumentFolderFieldProps, ref: RefObject<DndElement | null>): FolderFieldState => {
  const { value, roots = [] } = props;
  const drop = useFolderDrop(ref, props);
  const checked = useFolderCheck(value, drop.stamp);
  const start = value ?? roots[0];

  const browse = useCallback(
    async (): Promise<string | null> => (await getPlatform().documents?.openFolder(start === undefined ? {} : { defaultPath: start })) ?? null,
    [start],
  );
  const rootOptions = useMemo(() => roots.map((path) => ({ value: path, label: path })), [roots]);

  return { reason: drop.reason ?? checked, change: drop.change, browse, rootOptions, rootValue: value !== null && roots.includes(value) ? value : undefined };
};

export { useFolderField };
