/* @layer renderer-shell @kind component */
import { useCallback, useMemo } from 'react';
import { Stack } from '@drizztdourden08/tessera/primitives';
import { CheckCard } from '../ChecksView/sub-components/CheckCard';
import { useCheckToasts } from './behavior/useCheckToasts';
import { useOnlineNoticeToasts } from './behavior/useOnlineNoticeToasts';
import { IGNORE_MARK, LOAD_QUIET_MS, TOAST_DURATION_MS } from './CheckToasts.constants';
import type { CheckToastsProps } from './CheckToasts.type';
import { OnlineNoticeToast } from './sub-components/OnlineNoticeToast';
import { PlayAreaNotice } from './sub-components/PlayAreaNotice';
import type { PlayAreaNoticeItem } from './sub-components/PlayAreaNotice';

const CheckToasts = (props: CheckToastsProps) => {
  const { enabled = true, duration = TOAST_DURATION_MS, quietMs = LOAD_QUIET_MS, noticeShown } = props;
  const checks = useCheckToasts(enabled, quietMs);
  const notices = useOnlineNoticeToasts(enabled, noticeShown);
  const { dismiss: dismissCheck } = checks;
  const { dismiss: dismissNotice } = notices;

  const items: PlayAreaNoticeItem[] = useMemo(() => [
    ...checks.entries.map(({ id, row }) => ({
      id,
      label: row.label,
      content: <CheckCard row={row} onToggle={IGNORE_MARK} />,
    })),
    ...notices.entries.map(({ id, notice }) => ({ id, label: notice.text, content: <OnlineNoticeToast notice={notice} /> })),
  ], [checks.entries, notices.entries]);

  const dismiss = useCallback((id: string) => {
    dismissCheck(id);
    dismissNotice(id);
  }, [dismissCheck, dismissNotice]);

  if (items.length === 0) return null;
  return (
    <Stack gap="xs">
      {items.map((item) => (
        <PlayAreaNotice key={item.id} item={item} duration={duration} onDismiss={dismiss} />
      ))}
    </Stack>
  );
};

export { CheckToasts };
