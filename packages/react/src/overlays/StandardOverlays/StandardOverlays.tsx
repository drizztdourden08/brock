/* @layer renderer-shell @kind component */
import { BugReportDialog } from '../../bug-report/BugReportDialog/BugReportDialog';
import { PaletteHost } from '../../palette/PaletteHost/PaletteHost';
import { ToastHost } from '../../toast/ToastHost/ToastHost';
import type { StandardOverlaysProps } from './StandardOverlays.type';

const StandardOverlays = (props: StandardOverlaysProps) => {
  const { menu, actions } = props;
  return (
    <>
      <PaletteHost menu={menu} actions={actions} />
      <BugReportDialog />
      <ToastHost />
    </>
  );
};

export { StandardOverlays };
