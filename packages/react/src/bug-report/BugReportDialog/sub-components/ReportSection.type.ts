/* @layer renderer-shell @kind types */
import type { ComponentType } from 'react';
import type { BugReportSectionProps } from '../../bug-report.type';

interface ReportSectionProps extends BugReportSectionProps {
  section: ComponentType<BugReportSectionProps> | null;
}

export type { ReportSectionProps };
