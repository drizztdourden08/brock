/* @layer renderer-shell @kind logic */
import { startFileAudition } from '../../audition';
import type { FileAuditionRun } from './run-file-audition.type';

const runFileAudition = async (run: FileAuditionRun): Promise<void> => {
  const { fileName, read, isCurrent, setters } = run;
  const { setPlaying, setAudition, setLoading, setLoops } = setters;
  const clear = (): void => {
    if (isCurrent()) { setPlaying(null); setAudition(null); }
  };
  try {
    const bytes = new Uint8Array(await read());
    const started = await startFileAudition(fileName, bytes, clear);
    if (!isCurrent()) { started.stop(); return; }
    setLoops((known) => new Map(known).set(fileName, started.loopSeconds));
    setPlaying(fileName);
    setAudition(started);
  } catch {
    clear();
  } finally {
    setLoading((name) => (name === fileName ? null : name));
  }
};

export { runFileAudition };
