/* @layer tooling-scripts @kind logic */
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { noteBody } from '@drizztdourden08/standards/release-notes';
import { notePath } from '../../release-notes/check-note-file.mjs';
import { packAll } from './release-packages.mjs';
import { stop } from './release-stop.mjs';
import { copyIn, digestOf, isReleased, moveIn, storeDir, writeManifest, writeNotes } from './release-store.mjs';

const noteText = ({ cwd, project, version, packages }) => {
  if (existsSync(join(cwd, notePath(version)))) return noteBody(cwd, version);
  return [`# ${project} v${version}`, '', ...packages.map((pkg) => `- ${pkg.name} ${pkg.version}`), ''].join('\n');
};

const sweep = (dir) => {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) sweep(join(dir, entry.name));
    else unlinkSync(join(dir, entry.name));
  }
  rmdirSync(dir);
};

const placeTarballs = (dir, packed) =>
  packed.map((pkg) => {
    const { sha512, sha256, size } = digestOf(moveIn(dir, pkg.tarball, pkg.file));
    return { name: pkg.name, version: pkg.version, tarball: pkg.tarball, sha512, sha256, size };
  });

const placeAssets = (dir, assets) =>
  assets.map((asset) => ({ name: asset.name, path: asset.name, kind: asset.kind ?? 'asset', ...digestOf(copyIn(dir, asset.name, asset.path)) }));

const manifestOf = ({ release, packages, assets, createdAt }) => ({
  kind: 'release',
  project: release.project,
  channel: release.channel,
  version: release.version,
  tag: `v${release.version}`,
  title: `${release.project} v${release.version}`,
  commit: release.commit,
  createdAt,
  publishedAt: createdAt,
  mode: 'local',
  notes: 'notes.md',
  packages,
  assets,
  replay: { state: 'pending', at: null, url: null },
});

/**
 * @param {{ release: { cwd: string, project: string, channel: string, version: string, commit: string }, packages: object[], exec: Function, extraAssets: Function }} input
 * @returns {string} the release.json path, the last file written
 */
const writeRelease = ({ release, packages, exec, extraAssets }) => {
  const dir = storeDir(release);
  if (isReleased(dir)) throw stop(`${dir} already holds a release. A released version is never rewritten; cut a new version.`);
  mkdirSync(dir, { recursive: true });
  const stage = mkdtempSync(join(dir, '.stage-'));
  try {
    const packed = packAll({ packages, stage, exec });
    const extra = extraAssets({ ...release, stage });
    const placed = placeTarballs(dir, packed);
    const assets = placeAssets(dir, extra);
    writeNotes(dir, noteText({ ...release, packages }));
    return writeManifest(dir, manifestOf({ release, packages: placed, assets, createdAt: new Date().toISOString() }));
  } finally {
    sweep(stage);
  }
};

export { writeRelease };
