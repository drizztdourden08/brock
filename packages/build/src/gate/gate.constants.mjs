/* @layer tooling-scripts @kind constants */
const CLANG_FORMAT_FILE = '.clang-format';
const CLANG_FORMAT_TEMPLATE = 'clang-format.tmpl';
const CLANG_FORMAT_ENV = 'BROCK_CLANG_FORMAT';
const CLANG_FORMAT_PACKAGE = 'clang-format-node';
const CLANG_FORMAT_SETTING = /\bclangFormat\s*:\s*\[\s*['"`]/;
const C_SOURCE = /\.[ch]$/;
const CLANG_FORMAT_BATCH = 40;
const VS_CLANG_FORMAT = ['VC', 'Tools', 'Llvm', 'x64', 'bin', 'clang-format.exe'];
const CLANG_FORMAT_HINT = `Pin it in the app, so CI and every machine run the same clang-format: pnpm add -D -E ${CLANG_FORMAT_PACKAGE}. ${CLANG_FORMAT_ENV} names another binary.`;

export {
  C_SOURCE, CLANG_FORMAT_BATCH, CLANG_FORMAT_ENV, CLANG_FORMAT_FILE, CLANG_FORMAT_HINT, CLANG_FORMAT_PACKAGE, CLANG_FORMAT_SETTING, CLANG_FORMAT_TEMPLATE, VS_CLANG_FORMAT,
};
