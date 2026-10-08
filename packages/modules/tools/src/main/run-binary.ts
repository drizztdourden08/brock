/* @layer electron-main @kind logic */
import { spawn } from 'child_process';
import type { ToolRunOptions, ToolRunResult, ToolStream } from './tools-main.type';
import { RUN_TIMEOUT_MS } from './tools-main.constants';
import { lineSplitter } from './line-splitter';

const runBinary = (file: string, args: readonly string[], options: ToolRunOptions = {}): Promise<ToolRunResult> =>
  new Promise((resolve, reject) => {
    const { timeoutMs = RUN_TIMEOUT_MS, signal, cwd, env, onLine } = options;
    const child = spawn(file, [...args], { cwd, env, signal, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
    const output: Record<ToolStream, string> = { stdout: '', stderr: '' };
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeoutMs);
    const listen = (stream: ToolStream): void => {
      const lines = lineSplitter((line) => onLine?.(line, stream));
      child[stream].setEncoding('utf8');
      child[stream].on('data', (text: string) => {
        output[stream] += text;
        lines.push(text);
      });
      child[stream].on('end', lines.end);
    };
    listen('stdout');
    listen('stderr');
    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout: output.stdout, stderr: output.stderr, timedOut });
    });
  });

export { runBinary };
