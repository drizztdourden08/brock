/* @layer renderer-shell @kind constants */
const DATA_DIRECTORY = 'DATA';

const DOCUMENTS_DIRECTORY = 'DOCUMENTS';

const UTF8 = 'utf8';

const PLUGINS = { files: 'Filesystem', app: 'App', haptics: 'Haptics', keepAwake: 'KeepAwake' } as const;

const BASE64_CHUNK = 0x8000;

const LONGEST_VIBRATION_MS = 1000;

const BACK_EDGE_EVENT = 'brock:back';

export { BACK_EDGE_EVENT, BASE64_CHUNK, DATA_DIRECTORY, DOCUMENTS_DIRECTORY, LONGEST_VIBRATION_MS, PLUGINS, UTF8 };
