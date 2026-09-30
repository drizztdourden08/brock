/* @layer renderer-shell @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { bugReport } from '../bug-report';
import type { BugReportButtonProps } from './BugReportButton.type';
import './BugReportButton.css';

const BugReportButton = (props: BugReportButtonProps) => {
  const { className = '', onBeforeOpen } = props;
  const open = () => {
    onBeforeOpen?.();
    bugReport.open();
  };
  return (
    <IconButton
      variant="ghost"
      size="sm"
      label="Report a bug"
      className={`bug-report-button${className ? ` ${className}` : ''}`}
      onClick={open}
    >
      <Icon name="bug" size={14} />
    </IconButton>
  );
};

export { BugReportButton };
