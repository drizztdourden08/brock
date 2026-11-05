/* @layer renderer-shell @kind types */
import type { useControllerReportForm } from './behavior/useControllerReportForm';
import type { ControllerReportDialogProps } from './ControllerReportDialog.type';

type UseControllerReportForm = ReturnType<typeof useControllerReportForm>;

type ControllerReportFormParams = Pick<
  ControllerReportDialogProps,
  'deviceKey' | 'identity' | 'debugText' | 'submit' | 'subjectPrefix'
>;

type ConfirmStepProps = Pick<
  UseControllerReportForm,
  'identity' | 'email' | 'name' | 'additionalInfo' | 'debugText' | 'detection' | 'calibrationMap' | 'diagnosticsReport' | 'status'
>;

type UserInfoStepProps = Pick<
  UseControllerReportForm,
  'identity' | 'email' | 'setEmail' | 'emailTouched' | 'emailValid' | 'name' | 'setName' | 'additionalInfo' | 'setAdditionalInfo' | 'debugText'
>;

export type { ConfirmStepProps, ControllerReportFormParams, UseControllerReportForm, UserInfoStepProps };
