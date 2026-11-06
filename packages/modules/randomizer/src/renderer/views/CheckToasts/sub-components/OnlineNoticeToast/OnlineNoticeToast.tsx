/* @layer renderer-shell @kind component */
import { Text } from '@drizztdourden08/tessera/primitives';
import { NOTICE_CLASSES } from '../../CheckToasts.constants';
import type { OnlineNoticeToastProps } from './OnlineNoticeToast.type';
import './OnlineNoticeToast.css';

const OnlineNoticeToast = ({ notice }: OnlineNoticeToastProps) => (
  <Text>
    {notice.parts.map((part, position) => (
      <Text key={`${position}-${part.text}`} className={part.tone === undefined ? undefined : NOTICE_CLASSES[part.tone]}>{part.text}</Text>
    ))}
  </Text>
);

export { OnlineNoticeToast };
