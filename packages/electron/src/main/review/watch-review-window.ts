/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { FAILED_STATUS } from './review.constants';
import type { ReviewSession } from './review-session.type';

const watchReviewWindow = (win: BrowserWindow, session: ReviewSession): void => {
  const { webContents } = win;
  webContents.on('console-message', (event) => {
    if (event.level === 'error') session.addConsoleError(`${event.message} (${event.sourceId}:${event.lineNumber})`);
  });
  webContents.on('did-fail-load', (_event, code, description, url) => {
    session.addFailedLoad(`page ${url}: ${description} (${code})`);
  });
  const { webRequest } = webContents.session;
  webRequest.onCompleted((details) => {
    if (details.statusCode >= FAILED_STATUS) session.addFailedLoad(`${details.url}: HTTP ${details.statusCode}`);
  });
  webRequest.onErrorOccurred((details) => {
    session.addFailedLoad(`${details.url}: ${details.error}`);
  });
};

export { watchReviewWindow };
