/* @layer electron-main @kind logic */
import { randomBytes } from 'crypto';
import { tmpdir } from 'os';
import { join } from 'path';
import { BRIDGE_NOT_PRIVATE } from './bridge.constants';
import { fileOwnerIs } from './file-owner-is';
import { sddlIsPrivate } from './sddl-is-private';

const accountOf = (): string => `${process.env.USERDOMAIN ?? ''}\\${process.env.USERNAME ?? ''}`;

const savedAclPath = (): string => join(tmpdir(), `brock-acl-${randomBytes(8).toString('hex')}.txt`);

const saveArgs = (name: string, saved: string): string[] => [name, '/save', saved, '/c'];

const ownerArgs = (name: string): string[] => ['/d', '/c', 'dir', '/q', name];

const icaclsVerdict = (name: string, listing: Buffer, sddl: string, userSid: string): string | null =>
  fileOwnerIs(listing.toString('latin1'), accountOf(), name) && sddlIsPrivate(sddl, userSid) ? null : BRIDGE_NOT_PRIVATE;

export { icaclsVerdict, ownerArgs, saveArgs, savedAclPath };
