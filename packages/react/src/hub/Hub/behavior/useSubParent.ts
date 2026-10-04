/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { ScreenParams } from '../../../navigation/navigation.type';
import { useNavigationStore } from '../../../navigation/useNavigationStore';

const useSubParent = (parentPage: string | null, params: ScreenParams): void => {
  useEffect(() => {
    if (parentPage === null) return undefined;
    const { setParent } = useNavigationStore.getState();
    setParent({ section: parentPage });
    return () => setParent(null);
  }, [parentPage, params]);
};

export { useSubParent };
