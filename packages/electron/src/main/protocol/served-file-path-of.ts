/* @layer electron-main @kind logic */
import { join, normalize, relative, isAbsolute } from 'path';

const requestPath = (requestUrl: string): string =>
  decodeURIComponent(new URL(requestUrl).pathname.replace(/^\/+/, ''));

const servedFilePathOf = (rootDir: string, requestUrl: string): string | null => {
  const full = join(rootDir, normalize(requestPath(requestUrl)));
  const back = relative(rootDir, full);
  if (back.startsWith('..') || isAbsolute(back)) return null;
  return full;
};

export { servedFilePathOf };
