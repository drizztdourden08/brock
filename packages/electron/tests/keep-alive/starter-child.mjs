/* @layer electron-main @kind test */
import './resolve-ts.mjs';

const { runServer } = await import('../../src/server/run-server.ts');

process.channel?.unref();
const handle = await runServer(() => ({ stop: () => undefined }), { heartbeatMs: 50 });
process.on('message', (message) => {
  if (message === 'stop') void handle?.stop();
});
process.send?.('ready');
