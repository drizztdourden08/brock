/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface CatalogInstallProgress {
  fraction: number;
  line: Text | null;
}

interface CatalogInstallBarText {
  install: string;
  update: string;
  uninstall: string;
  cancel: string;
  installed: string;
  installing: string;
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
