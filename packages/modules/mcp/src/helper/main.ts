/* @layer mcp-helper @kind entry */
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { appDirOf } from './app-dir-of';
import { createAppLink } from './create-app-link';
import { createServer } from './create-server';
import { HELPER_TEXT } from './helper.constants';
import type { TargetOptions } from './helper.type';
import { parseHelperArgs } from './helper-args';
import { helperLog } from './helper-log';
import { targetFileOf } from './target-file';

const appId = process.env.BROCK_HELPER_APP;
const options: TargetOptions = { app: appId === undefined || appId === '' ? null : appId, appDir: appDirOf(import.meta.url) };

process.on('uncaughtException', (error) => {
  helperLog(HELPER_TEXT.fatal(error.stack ?? error.message));
  process.exit(1);
});

const link = createAppLink(targetFileOf(parseHelperArgs(process.argv.slice(2), process.env), options));

const shutdown = (): void => {
  link.close();
  helperLog('stdin closed; the helper ends');
  process.exit(0);
};

const transport = new StdioServerTransport();
transport.onclose = shutdown;
process.stdin.once('end', shutdown);

void createServer(link, options)
  .connect(transport)
  .then(() => {
    helperLog(`ready; bridge file ${link.file()}`);
    link.warm();
  });
