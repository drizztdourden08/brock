/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MsuPackManifest } from '../../types';
import type { useSoundPanel } from './behavior/useSoundPanel';

type PackFormat = 'layered' | 'classic';

interface MsuPack {
  name: string;
  fileCount: number;
  totalSize: number;
}

interface MsuPackRow extends MsuPack {
  format: PackFormat;
}

interface MsuFile {
  name: string;
  size: number;
}

interface TrackInfo {
  fileName: string;
  trackNum: number;
  ext: string;
}

interface MatchedTrack {
  trackNum: number;
  description: string;
  fileName: string | null;
  layerCount: number;
}

interface ActionResult {
  success: boolean;
  message: string;
}

interface MsuManagerProps {
  onDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onRefresh: () => void;
}

interface MsuEffectsPanelProps {
  tabId: string;
  channels: readonly [string, string];
  pack: string;
  manifest: MsuPackManifest;
  saveBase: MsuPackManifest;
  files: MsuFile[];
  isLayered: boolean;
  readOnly: boolean;
  tabs: ReactNode;
  packPanel: ReactNode;
  onDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
  onReload: () => void;
}

interface TrackPreviewControls {
  playing: number | null;
  playingOriginal: number | null;
  onPreview: (trackNum: number) => void;
  onStopPreview: () => void;
  onPlayOriginal: (trackNum: number) => void;
}

interface TrackRowProps {
  row: MatchedTrack;
  fileSize?: number;
  selected: boolean;
  controls: TrackPreviewControls;
  onSelect: (trackNum: number) => void;
}

interface SoundRowData {
  soundId: number;
  hex: string;
  label: string | null;
  triggers: string[];
  sites: number;
  layerCount: number;
  unlisted: boolean;
  role: string | null;
  unreachable: boolean;
}

interface SoundRowProps {
  row: SoundRowData;
  channel: string;
  showChannel?: boolean;
  selected: boolean;
  playing: boolean;
  additive: boolean;
  playingOriginal: boolean;
  chipAudible: boolean | null;
  onSelect: (soundId: number) => void;
  onPreview: (channel: string, soundId: number) => void;
  onStopPreview: () => void;
  onPlayOriginal: (soundId: number) => void;
}

type SoundPanelController = ReturnType<typeof useSoundPanel>;

interface SoundListItemProps {
  channel: string;
  row: SoundRowData;
  sound: SoundPanelController;
  showChannel?: boolean;
  onSelect: (channel: string, soundId: number) => void;
  onPreview: (channel: string, soundId: number) => void;
  onPlayOriginal: (channel: string, soundId: number) => void;
}

export type {
  PackFormat,
  MsuPackRow,
  MsuFile,
  TrackInfo,
  MatchedTrack,
  ActionResult,
  MsuManagerProps,
  MsuEffectsPanelProps,
  TrackPreviewControls,
  TrackRowProps,
  SoundRowData,
  SoundRowProps,
  SoundPanelController,
  SoundListItemProps,
};
