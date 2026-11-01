/* @layer electron-main @kind test */
import type { AclEntry, AsyncSystemToolRun, FileSecurity, FileSecurityReader, SystemToolRun } from '../src/main/bridge/bridge.type';
import { BRIDGE_NOT_PRIVATE } from '../src/main/bridge/bridge.constants';

const ME = 'S-1-5-21-1-2-3-1001';
const OTHER = 'S-1-5-21-1-2-3-1004';
const SYSTEM = 'S-1-5-18';
const ADMINISTRATORS = 'S-1-5-32-544';
const USERS = 'S-1-5-32-545';
const EVERYONE = 'S-1-1-0';
const NOT_PRIVATE = BRIDGE_NOT_PRIVATE;

interface Reading {
  read: FileSecurityReader;
  files: string[];
}

interface Whoami {
  run: SystemToolRun;
  runAsync: AsyncSystemToolRun;
  calls: string[];
}

const allow = (sid: string): AclEntry => ({ kind: 'allow', sid });

const deny = (sid: string): AclEntry => ({ kind: 'deny', sid });

const security = (ownerSid: string, ...entries: AclEntry[]): FileSecurity => ({ ownerSid, entries });

const reading = (answer: FileSecurity | Error): Reading => {
  const files: string[] = [];
  const read: FileSecurityReader = (file) => {
    files.push(file);
    if (answer instanceof Error) throw answer;
    return answer;
  };
  return { read, files };
};

const whoami = (sid = ME): Whoami => {
  const calls: string[] = [];
  const answer = (exe: string): Buffer => {
    calls.push(exe);
    if (exe !== 'whoami.exe') throw new Error(`${exe} must not run`);
    return Buffer.from(`"PC\\me","${sid}"\r\n`, 'latin1');
  };
  return { run: answer, runAsync: (exe) => Promise.resolve(answer(exe)), calls };
};

export { ADMINISTRATORS, EVERYONE, ME, NOT_PRIVATE, OTHER, SYSTEM, USERS, allow, deny, reading, security, whoami };
