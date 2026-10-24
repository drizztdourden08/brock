/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { markOfTheWeb } from '../src/main/documents/mark-of-the-web';
import { MARKED_EXTENSIONS, ZONE_CONTENT } from '../src/main/documents/mark-of-the-web.constants';

const REPRESENTATIVE = ['.exe', '.docm', '.doc', '.zip', '.msc'];

describe('the extensions that get a Mark of the Web', () => {
  it('include a representative of each group and leave harmless ones out', () => {
    for (const extension of REPRESENTATIVE) expect(MARKED_EXTENSIONS.has(extension)).toBe(true);
    expect(MARKED_EXTENSIONS.has('.png')).toBe(false);
  });

  it('get the stream on Windows, in any case, and nothing else does', async () => {
    const writeFileTo = vi.fn<(path: string, data: string) => Promise<void>>().mockResolvedValue();
    for (const extension of REPRESENTATIVE) await markOfTheWeb(`C:\\g\\file${extension.toUpperCase()}`, { platform: 'win32', writeFile: writeFileTo });
    expect(writeFileTo).toHaveBeenCalledTimes(REPRESENTATIVE.length);
    expect(writeFileTo).toHaveBeenCalledWith('C:\\g\\file.EXE:Zone.Identifier', '[ZoneTransfer]\r\nZoneId=3\r\n');
    expect(ZONE_CONTENT).toBe('[ZoneTransfer]\r\nZoneId=3\r\n');
    writeFileTo.mockClear();
    for (const name of ['notes.txt', 'a.png', 'a.PNG', 'a.exe.txt', 'exe', 'a.docx', 'a.json']) await markOfTheWeb(`C:\\g\\${name}`, { platform: 'win32', writeFile: writeFileTo });
    expect(writeFileTo).not.toHaveBeenCalled();
  });

  it('is skipped off Windows', async () => {
    const writeFileTo = vi.fn<(path: string, data: string) => Promise<void>>().mockResolvedValue();
    await markOfTheWeb('/g/run.sh.exe', { platform: 'linux', writeFile: writeFileTo });
    await markOfTheWeb('/g/run.exe', { platform: 'darwin', writeFile: writeFileTo });
    expect(writeFileTo).not.toHaveBeenCalled();
  });

  it('never fails the write when the stream cannot be written', async () => {
    const failing = vi.fn<(path: string, data: string) => Promise<void>>().mockRejectedValue(new Error('no streams on this volume'));
    await expect(markOfTheWeb('C:\\g\\run.exe', { platform: 'win32', writeFile: failing })).resolves.toBeUndefined();
    expect(failing).toHaveBeenCalledTimes(1);
  });
});
