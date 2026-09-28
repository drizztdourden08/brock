/* @layer electron-main @kind logic */
import { net, protocol } from 'electron';
import { pathToFileURL } from 'url';
import { servedFilePathOf } from './served-file-path-of';

const serveDirectoryScheme = (scheme: string, rootDir: () => string): void => {
  protocol.handle(scheme, (request) => {
    const file = servedFilePathOf(rootDir(), request.url);
    if (!file) return new Response('Forbidden', { status: 403 });
    return net.fetch(pathToFileURL(file).href);
  });
};

export { serveDirectoryScheme };
