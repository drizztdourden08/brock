/* @layer tooling-scripts @kind logic */
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LICENCE_STAGED, MARK_STAGED } from '../installer/installer.constants.mjs';
import { markPng } from '../installer/mark-png.mjs';
import { STUB_DIR, STUB_LIBS, STUB_OUT, STUB_SOURCES, VC_TOOLS, VSWHERE } from './packaging.constants.mjs';
import { stubProductHeader } from './stub-product-header.mjs';
import { packIconOf } from './vpk-args.mjs';

const STUB_EXE = 'installer-stub.exe';

const findVcvars = () => {
  const hint = 'The installer stub needs the Visual Studio C++ build tools (the windows-latest runner has them).';
  if (!existsSync(VSWHERE)) throw new Error(`${VSWHERE} is missing. ${hint}`);
  const root = execFileSync(VSWHERE, ['-latest', '-products', '*', '-requires', VC_TOOLS, '-property', 'installationPath'], { encoding: 'utf8' }).trim();
  const vcvars = join(root, 'VC', 'Auxiliary', 'Build', 'vcvars64.bat');
  if (!root || !existsSync(vcvars)) throw new Error(`No C++ toolset found. ${hint}`);
  return vcvars;
};

/**
 * @param {string} rootDir
 * @param {string | null | undefined} rel
 * @param {string} what
 */
const requireAsset = (rootDir, rel, what) => {
  if (!rel || !existsSync(join(rootDir, rel))) throw new Error(`The installer stub needs ${what}; set icons.brand or the icon fields in brock.config.ts`);
  return join(rootDir, rel);
};

/**
 * @param {string} rootDir
 * @param {string | undefined} licence  root-relative
 */
const licenceText = (rootDir, licence) => (licence ? readFileSync(requireAsset(rootDir, licence, `product.installer.licence (${licence})`)) : '\n');

/**
 * @param {string} rootDir
 * @param {import('../installer/installer-inputs.mjs').InstallerInputs} inputs
 * @param {string} manifestUrl
 * @returns {string} the staging folder
 */
const stageStub = (rootDir, inputs, manifestUrl) => {
  const { config, colours } = inputs;
  const out = join(rootDir, STUB_OUT);
  const res = join(fileURLToPath(STUB_DIR), 'res');
  mkdirSync(join(out, 'obj'), { recursive: true });
  const appVersion = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8')).version ?? '0.0.0';
  writeFileSync(join(out, 'product.h'), stubProductHeader({ config, colours, manifestUrl, appVersion }));
  const rc = readFileSync(join(res, 'resources.rc.tmpl'), 'utf8')
    .replaceAll('__PRODUCT__', config.name.replace(/"/g, '""'))
    .replaceAll('__STUB_FILE__', `${config.id}-setup`);
  writeFileSync(join(out, 'resources.rc'), rc);
  copyFileSync(join(res, 'app.manifest'), join(out, 'app.manifest'));
  copyFileSync(requireAsset(rootDir, packIconOf(config, 'win32'), 'a Windows .ico'), join(out, 'app.ico'));
  writeFileSync(join(out, MARK_STAGED), markPng(rootDir, inputs).png);
  writeFileSync(join(out, LICENCE_STAGED), licenceText(rootDir, config.installer.licence));
  return out;
};

/**
 * @param {string} out
 * @param {string} vcvars
 */
const compile = (out, vcvars) => {
  const src = join(fileURLToPath(STUB_DIR), 'src');
  const rc = 'rc.exe /nologo /fo resources.res resources.rc';
  const cl = [
    'cl.exe /nologo /MT /O1 /GS- /EHsc /std:c++17 /DUNICODE /D_UNICODE /I .',
    `/Fo"obj/" /Fd"obj/" /Fe"${STUB_EXE}"`,
    ...STUB_SOURCES.map((file) => `"${join(src, file)}"`),
    'resources.res',
    '/link /SUBSYSTEM:WINDOWS /OPT:REF /OPT:ICF /INCREMENTAL:NO',
    ...STUB_LIBS,
  ].join(' ');
  const script = `call "${vcvars}" >nul && ${rc} && ${cl}`;
  execFileSync('cmd.exe', ['/d', '/s', '/c', `"${script}"`], { cwd: out, stdio: 'inherit', windowsVerbatimArguments: true });
};

/**
 * @param {string} rootDir
 * @param {import('../installer/installer-inputs.mjs').InstallerInputs} inputs
 * @param {string} manifestUrl
 * @returns {string} the built stub
 */
const buildInstallerStub = (rootDir, inputs, manifestUrl) => {
  const vcvars = findVcvars();
  const out = stageStub(rootDir, inputs, manifestUrl);
  compile(out, vcvars);
  return join(out, STUB_EXE);
};

export { buildInstallerStub };
