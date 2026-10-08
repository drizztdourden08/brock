/* @layer electron-main @kind logic */
import { appendMainLog } from '../logs/append-main-log';
import { stackOf } from '../crash-forensics/stack-of';
import { createOpenRouter } from './create-open-router';

const openRouter = createOpenRouter((err) => appendMainLog('error', `[open] a handler threw: ${stackOf(err)}`));

export { openRouter };
