/* @layer renderer-shell @kind types */
import type { RefObject } from 'react';
import type { SelectGroup } from '@drizztdourden08/tessera/primitives';
import type { UpdateInfo, UpdaterCapabilities, VersionOption } from '../../updater.type';
import type { UpdateStatus, UpdaterStoreState } from '../updater-store.type';

type UpdateAction = 'update' | 'reinstall' | 'downgrade';

interface VersionChoiceInput {
  open: boolean;
  info: UpdateInfo | null;
  versions: VersionOption[];
  loadVersions: () => Promise<void>;
}

interface VersionChoice {
  selected: string;
  setSelected: (version: string) => void;
  groups: SelectGroup[];
  chosen: VersionOption | null;
  isLatest: boolean;
  action: UpdateAction;
}

interface UpdateSummaryProps {
  status: UpdateStatus;
  info: UpdateInfo | null;
  currentVersion: string;
  capabilities: UpdaterCapabilities;
}

interface VersionPickerProps {
  groups: SelectGroup[];
  selected: string;
  onSelect: (version: string) => void;
  allowPrerelease: boolean;
  onAllowPrerelease: (allow: boolean) => void;
  disabled: boolean;
}

interface ReleaseNotesProps {
  notes: string;
}

interface DownloadStatusProps {
  status: UpdateStatus;
  percent: number;
  error: string | null;
  canInstall: boolean;
  info: UpdateInfo | null;
}

interface UpdateFootnoteProps {
  onReportBug: () => void;
}

interface DialogActionsProps {
  status: UpdateStatus;
  canCheck: boolean;
  canInstall: boolean;
  hasChoices: boolean;
  selected: string;
  isLatest: boolean;
  action: UpdateAction;
  info: UpdateInfo | null;
  confirmRef: RefObject<HTMLButtonElement | null>;
  onApply: (version: string | null) => void;
  onOpenReleasePage: (version: string | null) => void;
  onClose: () => void;
}

interface UpdateDialogModel {
  store: UpdaterStoreState;
  choice: VersionChoice;
  confirmRef: RefObject<HTMLButtonElement | null>;
  onAllowPrerelease: (allow: boolean) => void;
  busy: boolean;
  notes: string;
  showPicker: boolean;
  showPrereleaseNote: boolean;
  showFootnote: boolean;
}

export type {
  UpdateAction, UpdateDialogModel, VersionChoiceInput, VersionChoice, UpdateSummaryProps, VersionPickerProps, ReleaseNotesProps,
  DownloadStatusProps, UpdateFootnoteProps, DialogActionsProps,
};
