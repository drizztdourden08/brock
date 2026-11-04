/* @layer core @kind logic */
import type { NoticeKind, NoticePart, OnlineNotice } from './notice.type';

const noticeOf = (kind: NoticeKind, parts: readonly NoticePart[], counterpart?: string): OnlineNotice => ({
  kind,
  text: parts.map((part) => part.text).join(''),
  parts,
  ...(counterpart === undefined ? {} : { counterpart }),
});

export { noticeOf };
