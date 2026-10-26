/* @layer electron-main @kind logic */
import type { ChildProcess } from 'child_process';
import { PROCESS_LINE_MAX_CHARS, PROCESS_STREAMS } from './process-job.constants';
import { splitLines } from './split-lines';
import type { ProcessStream } from './process-job.type';

const attachOutput = (child: ChildProcess, onLine: (stream: ProcessStream, line: string) => void): (() => void) => {
  const splitters = PROCESS_STREAMS.map((stream) => {
    const splitter = splitLines((line) => onLine(stream, line), PROCESS_LINE_MAX_CHARS);
    const source = child[stream];
    source?.setEncoding('utf8');
    source?.on('data', (text: string) => splitter.push(text));
    return splitter;
  });
  return () => {
    for (const splitter of splitters) splitter.end();
  };
};

export { attachOutput };
