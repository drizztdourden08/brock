/* @layer renderer-shell @kind test */
import { describe, expect, it } from 'vitest';
import { bugReportFields } from '../src/bug-report/bug-report-fields';
import { isEmail } from '../src/bug-report/is-email';
import { readAttachments } from '../src/bug-report/read-attachments';

const fileOf = (name: string, size: number, type = 'text/plain'): File => new File([new Uint8Array(size)], name, { type });

describe('the bug report fields', () => {
  it('are off unless the app asks for them, and fill their defaults when it does', () => {
    expect(bugReportFields(null)).toEqual({ contact: null, attachments: null, afterSend: 'toast' });
    expect(bugReportFields({ contact: true, attachments: true, afterSend: 'view' })).toEqual({
      contact: { required: false, label: 'Contact email', hint: 'Only used to answer this report.' },
      attachments: { accept: [], maxFiles: 5, maxBytes: 10 * 1024 * 1024 },
      afterSend: 'view',
    });
    expect(bugReportFields({ contact: { required: true, label: 'Your email' }, attachments: { accept: ['.png'], maxFiles: 2 } })).toMatchObject({
      contact: { required: true, label: 'Your email' },
      attachments: { accept: ['.png'], maxFiles: 2 },
    });
  });

  it('take an email address and refuse anything else', () => {
    expect(isEmail('me@example.com')).toBe(true);
    expect(isEmail(' me@example.com ')).toBe(true);
    expect(isEmail('me@example')).toBe(false);
    expect(isEmail('not an email')).toBe(false);
  });

  it('read the files that fit and say why the others are left out', async () => {
    const field = { accept: [], maxFiles: 2, maxBytes: 8 };
    const first = await readAttachments([fileOf('a.txt', 4), fileOf('big.bin', 9), fileOf('b.png', 2, 'image/png'), fileOf('c.txt', 1)], [], field);
    expect(first.added.map((file) => [file.name, file.type, file.bytes.byteLength])).toEqual([['a.txt', 'text/plain', 4], ['b.png', 'image/png', 2]]);
    expect(first.refused).toEqual(['big.bin: larger than 8 B', 'c.txt: at most 2 files']);
    const later = await readAttachments([fileOf('d.txt', 1)], first.added, field);
    expect(later).toEqual({ added: [], refused: ['d.txt: at most 2 files'] });
  });
});
