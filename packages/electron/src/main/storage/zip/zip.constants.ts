/* @layer electron-main @kind constants */
const LOCAL_SIGNATURE = 0x04034b50;
const CENTRAL_SIGNATURE = 0x02014b50;
const END_SIGNATURE = 0x06054b50;
const LOCAL_SIZE = 30;
const CENTRAL_SIZE = 46;
const END_SIZE = 22;
const END_SEARCH = 65_557;
const ZIP_VERSION = 20;
const UTF8_FLAG = 0x0800;
const STORED = 0;
const DEFLATED = 8;
const ZIP_LIMIT = 0xffff_ffff;
const ENTRY_LIMIT = 0xffff;
const LIMIT_MESSAGE = 'a zip export holds at most 65535 files and 4 GB; export to a folder instead';

export { CENTRAL_SIGNATURE, CENTRAL_SIZE, DEFLATED, END_SEARCH, END_SIGNATURE, END_SIZE, ENTRY_LIMIT, LIMIT_MESSAGE, LOCAL_SIGNATURE, LOCAL_SIZE, STORED, UTF8_FLAG, ZIP_LIMIT, ZIP_VERSION };
