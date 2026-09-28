/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { RefObject } from 'react';
import { matchesShortcut } from '../../../screens/matches-shortcut';
import { HUB_SEARCH_SHORTCUT, SEARCH_MARK_SELECTOR } from '../../hub.constants';

const useHubSearchShortcut = (rootRef: RefObject<HTMLElement | null>, enabled: boolean): void => {
  useEffect(() => {
    if (!enabled) return;
    const handler = (e: KeyboardEvent): void => {
      if (!matchesShortcut(e, HUB_SEARCH_SHORTCUT)) return;
      const mark = rootRef.current?.querySelector<HTMLElement>(SEARCH_MARK_SELECTOR);
      if (!mark) return;
      e.preventDefault();
      mark.click();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [rootRef, enabled]);
};

export { useHubSearchShortcut };
