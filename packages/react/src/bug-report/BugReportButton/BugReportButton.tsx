/* @layer renderer-shell @kind component */
import { Icon, IconButton } from '@drizztdourden08/tessera/primitives';
import { useT } from '../../i18n';
import { bugReport } from '../bug-report';
import type { BugReportButtonProps } from './BugReportButton.type';

const BugReportButton = (props: BugReportButtonProps) => {
  const { className = '', onBeforeOpen } = props;
  const t = useT();
  const open = () => {
    onBeforeOpen?.();
    bugReport.open();
  };
  return (
    <IconButton
      variant="ghost"
      tone="danger"
      size="sm"
      label={t('brock-app:bugReport.title')}
      className={`bug-report-button${className ? ` ${className}` : ''}`}
      onClick={open}
    >
      <Icon name="bug" size={14} />
    </IconButton>
  );
};

export { BugReportButton };
