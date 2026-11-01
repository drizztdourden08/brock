#!/usr/bin/env node
/* @layer tooling-scripts @kind logic */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { findProjectBuild } from '../src/find-project-build.mjs';
import { findProjectThread } from '../src/find-project-thread.mjs';
import { localModeOn } from '../src/local-mode.mjs';
import { mismatchNote } from '../src/mismatch-note.mjs';
import { ownPackage } from '../src/own-package.mjs';
import { runnerFor } from '../src/runner-for.mjs';
import { staleRunnerRefusal } from '../src/stale-runner-refusal.mjs';
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
  const thread = project ? null : findProjectThread(process.cwd());
  const runner = runnerFor(command, project, join(globalBuild.dir, 'bin', 'brock.mjs'), thread);
  const refusal = staleRunnerRefusal(command, localModeOn(), runner);
  if (refusal) {
    process.stderr.write(refusal);
    return 1;
  }
  return runFile(runner, process.argv.slice(2));
};

process.exit(main());
