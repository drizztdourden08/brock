/* @layer renderer-shell @kind component */
import { BugReportDialog } from '../../bug-report/BugReportDialog/BugReportDialog';
import { SearchPalette } from '../../palette/SearchPalette/SearchPalette';
import { ToastHost } from '../../toast/ToastHost/ToastHost';
import { WidgetHost } from '../../widgets/WidgetHost/WidgetHost';
import type { StandardOverlaysProps } from './StandardOverlays.type';

const StandardOverlays = (props: StandardOverlaysProps) => {
  const { menu, actions, widgets } = props;
  return (
    <>
      <WidgetHost widgets={widgets} />
      <SearchPalette menu={menu} actions={actions} />
      <BugReportDialog />
      <ToastHost />
    </>
  );
};

export { StandardOverlays };
