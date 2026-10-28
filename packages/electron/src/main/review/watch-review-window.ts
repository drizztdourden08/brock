/* @layer electron-main @kind logic */
import type { BrowserWindow } from 'electron';
import { isBenignBrowserError } from '@drizztdourden08/brock-core/log';
import { bootEvents } from '../boot/boot-events';
import { FAILED_STATUS } from './review.constants';
import type { ReviewSession } from './review-session.type';

const watchReviewWindow = (win: BrowserWindow, session: ReviewSession): void => {
  const { webContents } = win;
  webContents.on('console-message', (event) => {
    if (event.level === 'error' && !isBenignBrowserError(event.message)) session.addConsoleError(`${event.message} (${event.sourceId}:${event.lineNumber})`);
  });
  webContents.on('did-fail-load', (_event, code, description, url) => {
    session.addFailedLoad(`page ${url}: ${description} (${code})`);
  });
  const { webRequest } = webContents.session;
  webRequest.onCompleted((details) => {
    bootEvents.emit('activity');
    if (details.statusCode >= FAILED_STATUS) session.addFailedLoad(`${details.url}: HTTP ${details.statusCode}`);
    else session.markLoaded(details.url);
  });
  webRequest.onErrorOccurred((details) => {
    session.addRequestError(details.url, `${details.url}: ${details.error}`);
  });
};

export { watchReviewWindow };
