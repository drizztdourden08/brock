/* @layer electron-main @kind test */
import { describe, expect, it, vi } from 'vitest';
import { captureDrops } from '../src/preload/drop-capture';
import { createDropTickets } from '../src/main/documents/drop-tickets';
import { DROP_TICKET_LIMIT, DROP_TICKET_TTL_MS } from '../src/main/documents/drop-tickets.constants';

type Listener = (event: { isTrusted: boolean; dataTransfer: { files: File[] } | null }) => void;

const dropOn = (): { fire: Listener; capture: boolean[]; sent: string[][] } => {
  const listeners: Listener[] = [];
  const capture: boolean[] = [];
  const sent: string[][] = [];
  captureDrops(
    { addEventListener: (_type, listener, useCapture) => { listeners.push(listener); capture.push(useCapture); } },
    (file) => file.name,
    (paths) => sent.push(paths),
  );
  return { fire: (event) => listeners.forEach((listener) => listener(event)), capture, sent };
};

const filesOf = (...names: string[]): File[] => names.map((name) => ({ name }) as File);

describe('K4 the drop ticket store', () => {
  it('lets a window use a ticketed path once and no other window use it', { tags: ['critical'] }, () => {
    const tickets = createDropTickets();
    tickets.issue(1, ['D:\\art']);
    expect(tickets.take(2, 'D:\\art')).toBe(false);
    expect(tickets.take(1, 'D:\\other')).toBe(false);
    expect(tickets.take(1, 'D:\\art')).toBe(true);
    expect(tickets.take(1, 'D:\\art')).toBe(false);
  });

  it('expires a ticket after its time', { tags: ['critical'] }, () => {
    let clock = 1000;
    const tickets = createDropTickets(() => clock);
    tickets.issue(1, ['D:\\art']);
    clock += DROP_TICKET_TTL_MS - 1;
    expect(tickets.has(1)).toBe(true);
    clock += 1;
    expect(tickets.take(1, 'D:\\art')).toBe(false);
    expect(tickets.has(1)).toBe(false);
  });

  it('holds at most the ticket limit per window and forgets a closed window', { tags: ['critical'] }, () => {
    const tickets = createDropTickets();
    const paths = Array.from({ length: DROP_TICKET_LIMIT + 5 }, (_, index) => `D:\\f${index}`);
    tickets.issue(1, paths);
    expect(tickets.take(1, paths[DROP_TICKET_LIMIT - 1] as string)).toBe(true);
    expect(tickets.take(1, paths[DROP_TICKET_LIMIT] as string)).toBe(false);
    tickets.forget(1);
    expect(tickets.has(1)).toBe(false);
  });
});

describe('K4 the preload drop capture', () => {
  it('listens in the capture phase and sends the paths of a trusted drop', { tags: ['critical'] }, () => {
    const page = dropOn();
    page.fire({ isTrusted: true, dataTransfer: { files: filesOf('D:\\a.png', 'D:\\b.png') } });
    expect(page.capture).toEqual([true]);
    expect(page.sent).toEqual([['D:\\a.png', 'D:\\b.png']]);
  });

  it('ignores a drop that page script made up', { tags: ['critical'] }, () => {
    const page = dropOn();
    page.fire({ isTrusted: false, dataTransfer: { files: filesOf('D:\\a.png') } });
    expect(page.sent).toEqual([]);
  });

  it('sends nothing for a drop without files or with paths that cannot be read', { tags: ['critical'] }, () => {
    const send = vi.fn();
    let listener: Listener | undefined;
    captureDrops(
      { addEventListener: (_type, given) => { listener = given; } },
      (file) => {
        if (file.name === 'boom') throw new Error('no path');
        return '';
      },
      send,
    );
    listener?.({ isTrusted: true, dataTransfer: null });
    listener?.({ isTrusted: true, dataTransfer: { files: filesOf('boom', 'virtual') } });
    expect(send).not.toHaveBeenCalled();
  });
});
