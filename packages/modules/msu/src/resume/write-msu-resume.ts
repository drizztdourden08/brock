/* @layer core @kind logic */
import type { WriteMsuResumeParams } from './resume.type';
import { resumePath } from './resume-path';

const writeMsuResume = (params: WriteMsuResumeParams): Promise<void> => {
  const { config, files, slot, state } = params;
  return files.writeText(resumePath(config, slot), `${JSON.stringify(state, null, 2)}\n`);
};

export { writeMsuResume };
