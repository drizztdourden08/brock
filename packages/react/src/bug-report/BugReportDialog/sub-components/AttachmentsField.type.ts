/* @layer renderer-shell @kind types */
import type { BugReportAttachment } from '@drizztdourden08/brock-core';
import type { BugReportAttachmentField } from '../../bug-report.type';

interface AttachmentsFieldProps {
  field: BugReportAttachmentField;
  attachments: readonly BugReportAttachment[];
  refused: readonly string[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export type { AttachmentsFieldProps };
