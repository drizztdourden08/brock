#!/usr/bin/env node
/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findProjectBuild } from '../src/find-project-build.mjs';
import { mismatchNote } from '../src/mismatch-note.mjs';
import { ownPackage } from '../src/own-package.mjs';
import { versionReport } from '../src/version-report.mjs';

const OWN_VERSION = JSON.parse(readFileSync(join(import.meta.dirname, '..', 'package.json'), 'utf8')).version;
const VERSION_FLAGS = new Set(['--version', '-v']);

const runFile = (file, args) => spawnSync(process.execPath, [file, ...args], { stdio: 'inherit' }).status ?? 1;

const main = () => {
  const [command, ...rest] = process.argv.slice(2);
  const project = findProjectBuild(process.cwd());
  if (VERSION_FLAGS.has(command)) {
    process.stdout.write(versionReport(OWN_VERSION, project));
    return 0;
  }
  if (command === 'create') {
    const create = ownPackage(import.meta.resolve('@drizztdourden08/create-brock/package.json'));
    return runFile(join(create.dir, 'bin', 'create-brock.mjs'), rest);
  }
  const globalBuild = ownPackage(import.meta.resolve('@drizztdourden08/brock-build/package.json'));
  const note = mismatchNote(project, globalBuild.version);
  if (note) process.stderr.write(note);
  return runFile(project?.bin ?? join(globalBuild.dir, 'bin', 'brock.mjs'), process.argv.slice(2));
};

process.exit(main());
