/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface CatalogInstallProgress {
  fraction: number;
  line: Text | null;
}

interface CatalogInstallBarText {
  install: Text;
  update: Text;
  uninstall: Text;
  cancel: Text;
  installed: Text;
  installing: Text;
}

interface CatalogInstallBarProps {
  installed: boolean;
  onInstall: () => void;
  hasUpdate?: boolean;
  progress?: CatalogInstallProgress | null;
  error?: string | null;
  onUninstall?: () => void;
  onCancel?: () => void;
  text?: Partial<CatalogInstallBarText>;
  className?: string;
}

interface InstallProgressProps {
  progress: CatalogInstallProgress;
  text: CatalogInstallBarText;
  onCancel?: () => void;
}

type InstallActionsProps = Omit<CatalogInstallBarProps, 'progress' | 'text' | 'className' | 'onCancel'> & { text: CatalogInstallBarText; onCancel?: () => void };

export type { CatalogInstallBarProps, CatalogInstallBarText, CatalogInstallProgress, InstallProgressProps, InstallActionsProps };
