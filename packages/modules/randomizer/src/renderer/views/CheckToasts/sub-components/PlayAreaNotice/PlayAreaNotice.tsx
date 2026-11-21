/* @layer renderer-shell @kind component */
import { useCallback, useEffect } from 'react';
import { useText } from '@drizztdourden08/brock-react';
import { Flex, Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { DISMISS_LABEL } from './PlayAreaNotice.constants';
import type { PlayAreaNoticeProps } from './PlayAreaNotice.type';

const PlayAreaNotice = ({ item, duration, onDismiss }: PlayAreaNoticeProps) => {
  const text = useText();
  const { id, label, content } = item;
  const dismiss = useCallback(() => onDismiss(id), [id, onDismiss]);

  useEffect(() => {
    if (duration <= 0) return undefined;
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [duration, dismiss]);

  return (
    <Flex gap="sm" align="center" role="status" aria-label={label}>
      {content}
      <IconButton variant="ghost" size="xs" label={text(DISMISS_LABEL)} onClick={dismiss}>
        <Icon name="x" />
      </IconButton>
    </Flex>
  );
};

export { PlayAreaNotice };
