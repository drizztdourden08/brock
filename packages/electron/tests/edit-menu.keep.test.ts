/* @layer electron-main @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { installEditMenu } from '../src/main/window/edit-menu';

interface Item {
  label?: string;
  type?: string;
  role?: string;
  accelerator?: string;
  click?: (menuItem: unknown, win: unknown) => void;
}

const shared = vi.hoisted(() => ({ template: [] as Array<{ submenu: Item[] }>, answer: vi.fn<(...args: unknown[]) => Promise<boolean>>() }));

vi.mock('electron', () => ({
  Menu: {
    buildFromTemplate: (template: Array<{ submenu: Item[] }>) => {
      shared.template = template;
      return { template };
    },
    setApplicationMenu: vi.fn(),
  },
}));

vi.mock('../src/main/ipc/ask-within', () => ({
  askWithin: (...args: unknown[]) => shared.answer(...args),
}));

const makeWindow = () => ({
  isDestroyed: () => false,
  webContents: { undo: vi.fn(), redo: vi.fn(), cut: vi.fn(), copy: vi.fn(), paste: vi.fn(), selectAll: vi.fn() },
});

const itemOf = (label: string): Item => {
  const found = shared.template[0]?.submenu.find((each) => each.label === label);
  if (found === undefined) throw new Error(`no menu item ${label}`);
  return found;
};

const click = async (label: string, win: unknown): Promise<void> => {
  itemOf(label).click?.({}, win);
  await new Promise<void>((resolve) => { setImmediate(resolve); });
};

beforeEach(() => {
  shared.answer.mockReset();
});

describe('the edit menu', () => {
  it('lists the six edit items without native roles, with the accelerator of the platform', () => {
    installEditMenu('darwin');
    const items = shared.template[0]?.submenu ?? [];
    expect(items.map((each) => each.label ?? each.type)).toEqual(['Undo', 'Redo', 'separator', 'Cut', 'Copy', 'Paste', 'Select All']);
    expect(items.every((each) => each.role === undefined)).toBe(true);
    expect(itemOf('Copy').accelerator).toBe('Cmd+C');
    expect(itemOf('Redo').accelerator).toBe('Shift+Cmd+Z');
    installEditMenu('win32');
    expect(itemOf('Copy').accelerator).toBe('Ctrl+C');
    expect(itemOf('Redo').accelerator).toBe('Ctrl+Y');
  });

  it('asks the renderer first and stands down when a command owns the chord', async () => {
    installEditMenu('darwin');
    shared.answer.mockResolvedValue(true);
    const win = makeWindow();
    await click('Copy', win);
    expect(shared.answer).toHaveBeenCalledWith(expect.any(Number), win, 'command:runEdit', 'copy');
    expect(win.webContents.copy).not.toHaveBeenCalled();
  });

  it('falls back to the native role when no command owns the chord', async () => {
    installEditMenu('darwin');
    shared.answer.mockResolvedValue(false);
    const win = makeWindow();
    await click('Paste', win);
    await click('Select All', win);
    expect(win.webContents.paste).toHaveBeenCalledTimes(1);
    expect(win.webContents.selectAll).toHaveBeenCalledTimes(1);
  });

  it('falls back to the native role when the renderer cannot answer', async () => {
    installEditMenu('linux');
    shared.answer.mockRejectedValue(new Error('no handler is registered'));
    const win = makeWindow();
    await click('Undo', win);
    expect(win.webContents.undo).toHaveBeenCalledTimes(1);
  });

  it('does nothing for a window that is gone', async () => {
    installEditMenu('darwin');
    const win = { ...makeWindow(), isDestroyed: () => true };
    await click('Cut', win);
    expect(shared.answer).not.toHaveBeenCalled();
    expect(win.webContents.cut).not.toHaveBeenCalled();
  });
});
