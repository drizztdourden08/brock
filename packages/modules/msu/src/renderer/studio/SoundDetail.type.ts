/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MsuPackManifest } from '../../types';
import type { MsuFile, SoundPanelController, SoundRowData } from './msu.type';

interface SoundDetailProps {
  pack: string;
  channel: string;
  row: SoundRowData;
  sound: SoundPanelController;
  manifest: MsuPackManifest;
  saveBase: MsuPackManifest;
  files: MsuFile[];
  isLayered: boolean;
  readOnly: boolean;
  onPreview: (channel: string, soundId: number) => void;
  onPlayOriginal: (channel: string, soundId: number) => void;
  onStopReplacing: (channel: string, soundId: number) => void;
  onClose: (channel: string) => void;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onReload: () => void;
}

type OpenSound = Pick<SoundDetailProps, 'channel' | 'row' | 'sound'>;

type SoundSideProps = Omit<SoundDetailProps, 'channel' | 'row' | 'sound'> & {
  open: OpenSound | null;
  noteTitle: string;
  note: string;
  packPanel: ReactNode;
};

export type { SoundDetailProps, SoundSideProps };
