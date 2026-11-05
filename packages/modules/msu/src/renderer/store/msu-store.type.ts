/* @layer renderer-shell @kind types */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { AudioProbe } from '../../audio-probe';
import type { MsuStudioGame } from '../game/msu-studio-game.type';
import type { createMsuStore } from './create-msu-store';
import type { ImportJobParams, ImportReport } from './import-job/import-job.type';

type MsuTrackEntry = { name: string; bytes: Uint8Array };

type MsuResult = {
  success: boolean;
  fileCount?: number;
  error?: string;
  skippedNested?: number;
  skippedDuplicate?: number;
};

type FetchProgress = (loaded: number, total: number | null) => void;

type FetchBytes = (url: string, onProgress?: FetchProgress) => Promise<Uint8Array>;

type RunJob = <Result>(params: ImportJobParams<Result>) => Promise<Result>;

interface MsuStoreDeps {
  files: FileStore;
  probe?: AudioProbe;
  fetchBytes?: FetchBytes;
  runJob?: RunJob;
}

interface MsuStoreEnv {
  game: MsuStudioGame;
  files: FileStore;
  probe: AudioProbe;
  fetchBytes: FetchBytes;
  runJob: RunJob;
}

type MsuTrackSource = (report: ImportReport) => Promise<{ bytes: Uint8Array; name: string }>;

type MsuStore = ReturnType<typeof createMsuStore>;

export type {
  FetchBytes, FetchProgress, MsuResult, MsuStore, MsuStoreDeps, MsuStoreEnv, MsuTrackEntry, MsuTrackSource, RunJob,
};
