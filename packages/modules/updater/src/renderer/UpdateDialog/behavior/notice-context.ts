/* @layer renderer-shell @kind logic */
import type { UpdateInfo } from '../../../updater.type';
import type { UpdateNoticeContext } from '../../update-notice.type';
import type { VersionChoice } from '../UpdateDialog.type';

const noticeContext = (choice: VersionChoice, info: UpdateInfo | null, currentVersion: string): UpdateNoticeContext | null => {
  const picked = choice.chosen ?? info;
  if (picked === null) return null;
  return {
    version: picked.version,
    currentVersion,
    action: choice.action,
    prerelease: choice.chosen?.prerelease === true,
    releaseNotes: picked.releaseNotes,
    release: picked.release ?? null,
  };
};

export { noticeContext };
