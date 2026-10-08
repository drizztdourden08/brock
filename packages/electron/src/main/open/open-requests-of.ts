/* @layer electron-main @kind logic */
import { extname, resolve } from 'path';
import type { OpenRequest } from '@drizztdourden08/brock-core/types';
import type { OpenArgsContext, OpenTargets } from './open.type';
import { MAX_OPEN_ARG, URL_ARG } from './open.constants';

const requestOf = (arg: string, targets: OpenTargets, { cwd, source }: OpenArgsContext): OpenRequest | null => {
  if (!arg || arg.startsWith('-') || arg.length > MAX_OPEN_ARG) return null;
  const scheme = URL_ARG.exec(arg)?.[1]?.toLowerCase();
  if (scheme !== undefined && targets.schemes.includes(scheme)) return { kind: 'url', url: arg, scheme, source };
  const ext = extname(arg).slice(1).toLowerCase();
  if (!ext || !targets.extensions.includes(ext)) return null;
  return { kind: 'file', path: resolve(cwd, arg), ext, source };
};

const openRequestsOf = (argv: readonly string[], targets: OpenTargets, context: OpenArgsContext): OpenRequest[] =>
  argv.slice(1).map((arg) => requestOf(arg, targets, context)).filter((request): request is OpenRequest => request !== null);

export { openRequestsOf };
