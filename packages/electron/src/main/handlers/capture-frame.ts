/* @layer electron-main @kind logic */
import type { WebContents } from 'electron';
import { DEBUGGER_PROTOCOL, SURFACE_CAPTURE_MS } from './capture-frame.constants';

const withinTime = <T>(work: Promise<T>, ms: number): Promise<T> => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`no frame within ${ms} ms`)), ms);
  work.then(resolve, reject).finally(() => clearTimeout(timer));
});

const surfaceFrame = async (contents: WebContents): Promise<Buffer> => {
  const { debugger: devtools } = contents;
  const attached = devtools.isAttached();
  if (!attached) devtools.attach(DEBUGGER_PROTOCOL);
  try {
    const shot = await withinTime(devtools.sendCommand('Page.captureScreenshot', { format: 'png', fromSurface: true }) as Promise<{ data: string }>, SURFACE_CAPTURE_MS);
    return Buffer.from(shot.data, 'base64');
  } finally {
    if (!attached && devtools.isAttached()) devtools.detach();
  }
};

const captureFrame = async (contents: WebContents): Promise<Buffer> => {
  try {
    return await surfaceFrame(contents);
  } catch {
    return (await contents.capturePage()).toPNG();
  }
};

export { captureFrame };
