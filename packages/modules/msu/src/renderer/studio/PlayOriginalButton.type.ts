/* @layer renderer-shell @kind types */
interface PlayOriginalButtonProps {
  subject: string;
  hasReplacement: boolean;
  playingOriginal: boolean;
  onPlayOriginal: () => void;
}

export type { PlayOriginalButtonProps };
