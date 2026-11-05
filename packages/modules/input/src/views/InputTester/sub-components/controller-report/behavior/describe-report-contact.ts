/* @layer renderer-shell @kind logic */
import type { ConfirmStepProps } from '../controller-report-form.type';

const describeReportContact = (params: Pick<ConfirmStepProps, 'identity' | 'email' | 'name'>): string => {
  const { identity, email, name } = params;
  if (identity) return identity.displayName;
  return `${email}${name.trim() ? ` (${name.trim()})` : ''}`;
};

export { describeReportContact };
