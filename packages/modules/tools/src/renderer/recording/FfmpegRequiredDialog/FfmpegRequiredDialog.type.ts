/* @layer renderer-shell @kind types */
interface FfmpegRequiredDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  skipLabel?: string;
}

export type { FfmpegRequiredDialogProps };
