/* @layer electron-main @kind constants */
const BRIDGE_PROTOCOL = 2;
const BRIDGE_SECRET_BYTES = 32;
const BRIDGE_NONCE_BYTES = 32;
const BRIDGE_NONCE = /^[A-Za-z0-9_-]{43}$/;
const BRIDGE_MAX_MESSAGE_BYTES = 1_048_576;
const BRIDGE_MAX_CLIENTS = 8;
const BRIDGE_MAX_PENDING = 4;
const BRIDGE_MAX_BUFFERED_BYTES = 4_194_304;
const BRIDGE_CONNECTION_ID_BYTES = 16;
const BRIDGE_WORLD_WRITABLE = 0o002;
const BRIDGE_STALE_OPEN = 'the bridge was closed while it opened';
const BRIDGE_HANDSHAKE_MS = 2_000;
const BRIDGE_REQUEST_TIMEOUT_MS = 30_000;
const BRIDGE_DISCOVERY_NAME = 'bridge';
const BRIDGE_LAUNCH_PREFIX = 'launch-';
const BRIDGE_PROFILE_LAUNCH_FILE = /^launch-bridge\.(data-[0-9a-f]{12})\.json$/;
const BRIDGE_PROFILE_LAUNCH_TTL_MS = 300_000;
const BRIDGE_USER_DATA_ARG = /^--user-data=(.+)$/;
const BRIDGE_RELAY_MAX_PENDING = 8;
const BRIDGE_ASK_TIMED_OUT = /timed out after/;
const BRIDGE_ASK_WINDOW_GONE = /the window (?:is closed|closed before)/;
const BRIDGE_LAUNCH_ARG = /^--(?:user-data|instance|profile)(?:=.+)?$/;
const BRIDGE_STRIPPED_ENV: readonly string[] = ['ELECTRON_RUN_AS_NODE', 'NODE_OPTIONS'];
const BRIDGE_FILE_ENV = 'BROCK_BRIDGE_FILE';
const BRIDGE_PIPE_PREFIX = '\\\\.\\pipe\\';
const BRIDGE_PIPE_NAME = /^brock-[A-Za-z0-9.-]+-[0-9a-f]{32}$/;
const BRIDGE_SOCKET_FILE = 'bridge.sock';
const BRIDGE_FILE_MODE = 0o600;
const BRIDGE_DIR_MODE = 0o700;
const BRIDGE_PERMISSION_BITS = 0o777;
const BRIDGE_OTHERS_MASK = 0o077;
const BRIDGE_LISTEN_TRIES = 3;
const BRIDGE_HELPERS_DIR = 'helpers';
const BRIDGE_HELPER_EXT = '.mjs';
const BRIDGE_RUN_AS_NODE = 'ELECTRON_RUN_AS_NODE';
const BRIDGE_HELPER_NAME = /^[a-z0-9][a-z0-9-]*$/;
const BRIDGE_NEWLINE = 10;
const BRIDGE_FAILED = 'the request failed';
const BRIDGE_ERROR_DATA_BYTES = 65_536;
const BRIDGE_TOO_LARGE = 'the reply is not JSON or is larger than the bridge allows';
const BRIDGE_ERROR_CODE = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const BRIDGE_CODES = { error: 'error', failed: 'failed', noHandler: 'no-handler', invalidArguments: 'invalid-arguments', tooLarge: 'too-large', timeout: 'timeout', closed: 'closed', noWindow: 'no-window', busy: 'busy' } as const;
const BRIDGE_WHOAMI = /"(S-[0-9-]+)"/;
const BRIDGE_SYSTEM32 = 'C:\\Windows\\System32';
const BRIDGE_WHOAMI_ARGS = ['/user', '/fo', 'csv', '/nh'];
const BRIDGE_NOT_PRIVATE = 'its owner or access list names an account other than you, SYSTEM or Administrators';
const BRIDGE_SE_FILE_OBJECT = 1;
const BRIDGE_SECURITY_QUERY = 0x00_00_00_05;
const BRIDGE_KERNEL32_DLL = 'kernel32.dll';
const BRIDGE_GET_SECURITY_SIGNATURE = 'uint32 GetNamedSecurityInfoW(str16 name, int32 kind, uint32 query, _Out_ void **owner, _Out_ void **group, _Out_ void **dacl, _Out_ void **sacl, _Out_ void **descriptor)';
const BRIDGE_CONVERT_SID_SIGNATURE = 'int ConvertSidToStringSidW(const void *sid, _Out_ void **text)';
const BRIDGE_LOCAL_FREE_SIGNATURE = 'void *LocalFree(void *memory)';
const BRIDGE_ACL_HEADER_BYTES = 8;
const BRIDGE_ACL_SIZE_OFFSET = 2;
const BRIDGE_ACL_COUNT_OFFSET = 4;
const BRIDGE_ACE_SIZE_OFFSET = 2;
const BRIDGE_ACE_SID_OFFSET = 8;
const BRIDGE_ACE_KINDS: readonly string[] = ['allow', 'deny'];
const BRIDGE_ACCEPTED_FILES_MAX = 64;
const BRIDGE_SDDL_ALIASES: readonly string[] = ['SY', 'BA'];
const BRIDGE_TRUSTED_SIDS: readonly string[] = ['S-1-5-18', 'S-1-5-32-544'];
const BRIDGE_IMPOSTOR = 'the endpoint could not prove it is the app; the bridge refuses it';

export {
  BRIDGE_CONNECTION_ID_BYTES, BRIDGE_MAX_BUFFERED_BYTES, BRIDGE_STALE_OPEN, BRIDGE_WORLD_WRITABLE, BRIDGE_CODES, BRIDGE_ERROR_CODE, BRIDGE_ERROR_DATA_BYTES, BRIDGE_TOO_LARGE,
  BRIDGE_DIR_MODE, BRIDGE_DISCOVERY_NAME, BRIDGE_LAUNCH_ARG, BRIDGE_LAUNCH_PREFIX, BRIDGE_PROFILE_LAUNCH_FILE, BRIDGE_PROFILE_LAUNCH_TTL_MS, BRIDGE_USER_DATA_ARG, BRIDGE_ASK_TIMED_OUT, BRIDGE_ASK_WINDOW_GONE, BRIDGE_RELAY_MAX_PENDING, BRIDGE_STRIPPED_ENV, BRIDGE_IMPOSTOR, BRIDGE_FAILED, BRIDGE_FILE_ENV, BRIDGE_FILE_MODE, BRIDGE_HANDSHAKE_MS, BRIDGE_HELPER_EXT, BRIDGE_HELPER_NAME,
  BRIDGE_HELPERS_DIR, BRIDGE_LISTEN_TRIES, BRIDGE_MAX_CLIENTS, BRIDGE_MAX_MESSAGE_BYTES, BRIDGE_MAX_PENDING, BRIDGE_NEWLINE, BRIDGE_NONCE,
  BRIDGE_NONCE_BYTES, BRIDGE_OTHERS_MASK, BRIDGE_PERMISSION_BITS, BRIDGE_PIPE_NAME, BRIDGE_PIPE_PREFIX, BRIDGE_PROTOCOL, BRIDGE_REQUEST_TIMEOUT_MS,
  BRIDGE_SE_FILE_OBJECT, BRIDGE_SECURITY_QUERY, BRIDGE_KERNEL32_DLL, BRIDGE_GET_SECURITY_SIGNATURE, BRIDGE_CONVERT_SID_SIGNATURE, BRIDGE_LOCAL_FREE_SIGNATURE,
  BRIDGE_ACL_HEADER_BYTES, BRIDGE_ACL_SIZE_OFFSET, BRIDGE_ACL_COUNT_OFFSET, BRIDGE_ACE_SIZE_OFFSET, BRIDGE_ACE_SID_OFFSET, BRIDGE_ACE_KINDS,
  BRIDGE_ACCEPTED_FILES_MAX, BRIDGE_WHOAMI_ARGS,
  BRIDGE_NOT_PRIVATE, BRIDGE_TRUSTED_SIDS, BRIDGE_RUN_AS_NODE, BRIDGE_SECRET_BYTES, BRIDGE_SOCKET_FILE, BRIDGE_SYSTEM32, BRIDGE_WHOAMI,
};
