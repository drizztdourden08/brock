#!/usr/bin/env node
/* @layer tooling-scripts @kind entry */
import { runThreadBin } from '../src/cli/run-thread-cli.mjs';

process.exitCode = await runThreadBin(process.argv.slice(2));
