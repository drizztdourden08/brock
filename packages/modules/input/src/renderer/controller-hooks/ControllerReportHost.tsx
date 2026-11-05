/* @layer renderer-shell @kind component */
import { useControllerReportStore } from './useControllerReportStore';
import type { ControllerReportHostProps } from './controller-hooks.type';

const ControllerReportHost = ({ children, renderDialog }: ControllerReportHostProps) => {
  const deviceKey = useControllerReportStore((state) => state.deviceKey);
  const close = useControllerReportStore((state) => state.close);

  return (
    <>
      {children}
      {deviceKey && renderDialog(deviceKey, close)}
    </>
  );
};

export { ControllerReportHost };
