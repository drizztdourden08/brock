/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { NO_PARAMS } from '../../../navigation/navigation.constants';
import type { ScreenParams } from '../../../navigation/navigation.type';
import { useNavigationStore } from '../../../navigation/useNavigationStore';

const UP_TO_PAGE = 'page';
const UP_TO_HOME = 'home';

const targetOf = (level: string | null, pageId: string): ScreenParams | null => {
  if (level === UP_TO_PAGE) return { section: pageId };
  return level === UP_TO_HOME ? NO_PARAMS : null;
};

const levelOf = (homeId: string, pageId: string, onSub: boolean): string | null => {
  if (onSub) return UP_TO_PAGE;
  return pageId === homeId ? null : UP_TO_HOME;
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
