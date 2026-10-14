/* @layer renderer-shell @kind types */
import type { BugReportContactField } from '../../bug-report.type';

interface ContactFieldProps {
  field: BugReportContactField;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
}

export type { ContactFieldProps };
