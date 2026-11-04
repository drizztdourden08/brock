/* @layer core @kind types */
import type { MsuLayer, MsuSoundDef } from '../types';

type LayerTransform = (layer: MsuLayer) => MsuLayer;

type SoundsByChannel = Record<string, MsuSoundDef[] | undefined>;

export type { LayerTransform, SoundsByChannel };
