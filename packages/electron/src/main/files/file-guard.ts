/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import type { FileWriteRequest } from './file-guard.type';
import { fileGuard } from './file-guard-state';

const refusal = (request: FileWriteRequest, reason: string | null): Error =>
  new Error(`The app refused to ${request.kind} "${request.path}"${reason ? `: ${reason}` : ''}`);

const checkFileWrite = async (request: FileWriteRequest, ctx: MainContext): Promise<void> => {
  const guard = fileGuard.current;
  if (!guard) return;
  const verdict = await guard(request, ctx);
  if (verdict === false) throw refusal(request, null);
  if (typeof verdict === 'string') throw refusal(request, verdict);
};

export { checkFileWrite };
