/* @layer renderer-shell @kind logic */
import type { MsuStudioGame } from '../game/msu-studio-game.type';
import { canTrashMsuPack } from './can-trash-msu-pack';
import { createMsuPack } from './create-msu-pack';
import { defaultFetchBytes } from './default-fetch-bytes';
import { defaultProbe } from './default-probe';
import { deleteMsuPack } from './delete-msu-pack';
import { deleteMsuResume } from './delete-msu-resume';
import { deleteMsuTrackFile } from './delete-msu-track-file';
import { getMsuFileMetadata } from './get-msu-file-metadata';
import { getMsuTrackList } from './get-msu-track-list';
import { importMsu } from './import-msu';
import { importMsuFile } from './import-msu-file';
import { runImportJob } from './import-job';
import { installMsulFile } from './install-msul-file';
import { listMsuAudioFiles } from './list-msu-audio-files';
import { listMsuPackEntries } from './list-msu-pack-entries';
import { listMsuPacks } from './list-msu-packs';
import type { MsuStoreDeps, MsuStoreEnv } from './msu-store.type';
import { readMsuLoopSample } from './read-msu-loop-sample';
import { readMsuManifest } from './read-msu-manifest';
import { readMsuResume } from './read-msu-resume';
import { readMsuTrackFile } from './read-msu-track-file';
import { renameMsuPack } from './rename-msu-pack';
import { renameMsuTrackFile } from './rename-msu-track-file';
import { writeMsuManifest } from './write-msu-manifest';
import { writeMsuResume } from './write-msu-resume';
import { writeMsuTrackFile } from './write-msu-track-file';

const createMsuStore = (game: MsuStudioGame<never, never>, deps: MsuStoreDeps) => {
  const env: MsuStoreEnv = {
    game: game as never,
    files: deps.files,
    probe: deps.probe ?? defaultProbe,
    fetchBytes: deps.fetchBytes ?? defaultFetchBytes,
    runJob: deps.runJob ?? runImportJob,
  };
  return {
    listMsuPacks: listMsuPacks(env),
    getMsuTrackList: getMsuTrackList(env),
    listMsuAudioFiles: listMsuAudioFiles(env),
    listMsuPackEntries: listMsuPackEntries(env),
    getMsuFileMetadata: getMsuFileMetadata(env),
    readMsuLoopSample: readMsuLoopSample(env),
    deleteMsuPack: deleteMsuPack(env),
    canTrashMsuPack: canTrashMsuPack(env),
    readMsuTrackFile: readMsuTrackFile(env),
    importMsuFile: importMsuFile(env),
    importMsu: importMsu(env),
    installMsulFile: installMsulFile(env),
    readMsuManifest: readMsuManifest(env),
    writeMsuManifest: writeMsuManifest(env),
    createMsuPack: createMsuPack(env),
    renameMsuPack: renameMsuPack(env),
    renameMsuTrackFile: renameMsuTrackFile(env),
    deleteMsuTrackFile: deleteMsuTrackFile(env),
    writeMsuTrackFile: writeMsuTrackFile(env),
    writeMsuResume: writeMsuResume(env),
    readMsuResume: readMsuResume(env),
    deleteMsuResume: deleteMsuResume(env),
  };
};

export { createMsuStore };
