/* @layer renderer-shell @kind hook */
import { useEffect, useRef } from 'react';
import { deathLinkOnlineNotice, queueNotice } from '../../../../archipelago';
import type { NoticeEntry, NoticeKind, OnlineNotice } from '../../../../archipelago';
import { onlineEvents } from '../../../../session/online/online-events';
import { useToastEntries } from './useToastEntries';

const useOnlineNoticeToasts = (enabled: boolean, shown: ((kind: NoticeKind) => boolean) | undefined) => {
  const { entries, setEntries, dismiss } = useToastEntries<NoticeEntry>();
  const serial = useRef(0);
  const shownRef = useRef(shown);
  shownRef.current = shown;

  useEffect(() => {
    if (!enabled) return undefined;
    const admit = (notice: OnlineNotice): void => {
      const nextId = (): string => `online-notice-${serial.current++}`;
      setEntries((prev) => queueNotice({ entries: prev, notice, shown: shownRef.current, now: Date.now(), nextId }));
    };
    return onlineEvents.add((event) => {
      if (event.type === 'notice') admit(event.notice);
      if (event.type === 'death-link') admit(deathLinkOnlineNotice(event.notice));
    });
  }, [enabled]);

  return { entries, dismiss };
};

export { useOnlineNoticeToasts };
