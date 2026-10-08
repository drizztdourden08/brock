/* @layer electron-main @kind logic */
import { rm, stat } from 'fs/promises';
import { fail, ok } from '@drizztdourden08/brock-core/result';
import type { Result } from '@drizztdourden08/brock-core/result';
import type { ToolDownload } from '../tools.type';
import { sha256File } from './sha256-file';

const mismatch = async (file: string, download: Pick<ToolDownload, 'sha256' | 'size'>): Promise<string | null> => {
  const { size } = await stat(file);
  if (download.size !== undefined && size !== download.size) return `the download is ${size} bytes, expected ${download.size}`;
  const digest = await sha256File(file);
  return digest === download.sha256.toLowerCase() ? null : `the download's sha256 is ${digest}, expected ${download.sha256.toLowerCase()}`;
};

const verifyDownload = async (file: string, download: Pick<ToolDownload, 'sha256' | 'size'>): Promise<Result> => {
  const problem = await mismatch(file, download);
  if (problem === null) return ok();
  await rm(file, { force: true });
  return fail(problem);
};

export { verifyDownload };
