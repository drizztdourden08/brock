/* @layer renderer-shell @kind types */
interface CatalogInstallProgress {
  fraction: number;
  line: string | null;
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
