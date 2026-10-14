/* @layer renderer-shell @kind logic */
import type { UpdateInfo } from '../../../updater.type';
import type { UpdateNoticeContext } from '../../update-notice.type';
import type { VersionChoice } from '../UpdateDialog.type';

const noticeContext = (choice: VersionChoice, info: UpdateInfo | null, currentVersion: string): UpdateNoticeContext | null => {
  const version = choice.chosen?.version ?? info?.version ?? null;
  if (version === null) return null;
  return { version, currentVersion, action: choice.action, prerelease: choice.chosen?.prerelease === true };
};

export { noticeContext };
