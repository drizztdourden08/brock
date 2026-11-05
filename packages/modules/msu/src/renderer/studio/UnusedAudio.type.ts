/* @layer renderer-shell @kind types */
import type { MsuTrackPanelProps } from './MsuTrackPanel.type';

type UnusedAudioProps = Pick<MsuTrackPanelProps, 'unusedFiles' | 'busy' | 'readOnly' | 'onDeleteFile'>;

export type { UnusedAudioProps };
