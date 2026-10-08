/* @layer tooling-scripts @kind constants */
const CLANG_FORMAT_FILE = '.clang-format';
const CLANG_FORMAT_TEMPLATE = 'clang-format.tmpl';
const CLANG_FORMAT_ENV = 'BROCK_CLANG_FORMAT';
const C_SOURCE = /\.[ch]$/;
const CLANG_FORMAT_BATCH = 40;
const VS_CLANG_FORMAT = ['VC', 'Tools', 'Llvm', 'x64', 'bin', 'clang-format.exe'];
const CLANG_FORMAT_HINT = `Install clang-format (LLVM; the Visual Studio C++ tools carry one), put it on the PATH, or name the binary in ${CLANG_FORMAT_ENV}.`;

export { C_SOURCE, CLANG_FORMAT_BATCH, CLANG_FORMAT_ENV, CLANG_FORMAT_FILE, CLANG_FORMAT_HINT, CLANG_FORMAT_TEMPLATE, VS_CLANG_FORMAT };
