/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import type { MenuIssue } from './menu-config.type';
import { reportMenuIssues } from './report-menu-issues';

const useMenuIssues = (issues: readonly MenuIssue[]): void => {
  useEffect(() => {
    reportMenuIssues(issues);
  }, [issues]);
};

export { useMenuIssues };
