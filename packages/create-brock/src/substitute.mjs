/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { TEMPLATE_IDENTITY } from './identity.mjs';

const IDENTITY_FILES = ['brock.config.ts', 'brock.workspace.mjs', 'package.json', 'README.md'];

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const replaceAll = (text, from, to) => (from ? text.replace(new RegExp(escapeRe(from), 'g'), to) : text);

/**
 * @param {string} text
 * @param {import('./identity.mjs').Identity} identity
 */
const substituteIdentity = (text, identity) => {
  let out = text;
  out = replaceAll(out, TEMPLATE_IDENTITY.appId, identity.appId);
  out = replaceAll(out, TEMPLATE_IDENTITY.authorEmail, identity.authorEmail);
  out = replaceAll(out, TEMPLATE_IDENTITY.authorName, identity.authorName);
  out = replaceAll(out, TEMPLATE_IDENTITY.id, identity.id);
  out = replaceAll(out, TEMPLATE_IDENTITY.name, identity.name);
  return out;
};

/**
 * @param {string} text
 * @param {import('./identity.mjs').Identity} identity
 */
const dropEmptyEmail = (text, identity) =>
  identity.authorEmail ? text : text.replace(/,\s*email:\s*''\s*/, ' ');

/**
 * @param {string} targetDir
 * @param {import('./identity.mjs').Identity} identity
 * @returns {string[]}  The files changed
 */
const applyIdentity = (targetDir, identity) => {
  const changed = [];
  for (const rel of IDENTITY_FILES) {
    const file = join(targetDir, rel);
    if (!existsSync(file)) continue;
    const before = readFileSync(file, 'utf8');
    let after = substituteIdentity(before, identity);
    if (rel === 'brock.config.ts') after = dropEmptyEmail(after, identity);
    if (after === before) continue;
    writeFileSync(file, after, 'utf8');
    changed.push(rel);
  }
  return changed;
};

export { applyIdentity };
