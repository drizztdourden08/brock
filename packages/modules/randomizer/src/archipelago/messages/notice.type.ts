/* @layer core @kind types */
type NoticeKind =
  | 'itemReceived'
  | 'itemSent'
  | 'ownCheck'
  | 'otherCheck'
  | 'hintOwn'
  | 'hintOther'
  | 'connection'
  | 'join'
  | 'goal'
  | 'release'
  | 'deathLink'
  | 'chat';

type NoticeTone = 'item' | 'player';

interface NoticePart {
  text: string;
  tone?: NoticeTone;
}

interface OnlineNotice {
  kind: NoticeKind;
  text: string;
  parts: readonly NoticePart[];
  counterpart?: string;
}

export type { NoticeKind, NoticePart, NoticeTone, OnlineNotice };
