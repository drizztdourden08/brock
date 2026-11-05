/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { NOTICE_TONES } from '../../CheckToasts.constants';
import type { OnlineNoticeToastProps } from './OnlineNoticeToast.type';

const OnlineNoticeToast = ({ notice }: OnlineNoticeToastProps) => (
  <Text>
    {notice.parts.map((part, position) => (
      <Text key={`${position}-${part.text}`} tone={part.tone === undefined ? undefined : NOTICE_TONES[part.tone]}>{part.text}</Text>
    ))}
  </Text>
);

export { OnlineNoticeToast };
