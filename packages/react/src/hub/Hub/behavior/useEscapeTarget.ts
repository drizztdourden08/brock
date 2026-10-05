/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { NO_PARAMS } from '../../../navigation/navigation.constants';
import type { ScreenParams } from '../../../navigation/navigation.type';
import { useNavigationStore } from '../../../navigation/useNavigationStore';

const targetOf = (level: 'page' | 'home' | null, pageId: string): ScreenParams | null => {
  if (level === 'page') return { section: pageId };
  return level === 'home' ? NO_PARAMS : null;
};

const levelOf = (homeId: string, pageId: string, onSub: boolean): 'page' | 'home' | null => {
  if (onSub) return 'page';
  return pageId === homeId ? null : 'home';
};

const useEscapeTarget = (homeId: string, pageId: string, onSub: boolean): void => {
  const level = levelOf(homeId, pageId, onSub);
  useEffect(() => {
    const target = targetOf(level, pageId);
    if (target === null) return undefined;
    const { setEscapeTo } = useNavigationStore.getState();
    setEscapeTo(target);
    return () => setEscapeTo(null);
  }, [level, pageId]);
};

export { useEscapeTarget };
