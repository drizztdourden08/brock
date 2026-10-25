/* @layer electron-main @kind test */
import { vi } from 'vitest';
import { createAutomationFlags } from '@drizztdourden08/brock-core/automation';
import { electronDialogMock } from './electron-dialog-mock';

interface FakeParent {
  visible: boolean;
  minimized: boolean;
  destroyed: boolean;
}

const showMessageBox = electronDialogMock.dialog.showMessageBox;
const flags = createAutomationFlags();
const automation = { ...flags, isAutomationLaunch: () => true };
const log = vi.fn();

const parentOf = ({ visible, minimized, destroyed }: FakeParent): never =>
  ({ isVisible: () => visible, isMinimized: () => minimized, isDestroyed: () => destroyed }) as never;

const resetDialogs = (): void => {
  showMessageBox.mockReset();
  showMessageBox.mockResolvedValue({ response: 0 });
  log.mockClear();
};

export { automation, flags, log, parentOf, resetDialogs, showMessageBox };
