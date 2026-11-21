/* @layer electron-main @kind constants */
import { msg } from '@drizztdourden08/brock-core/i18n';
const FFMPEG_VERSION = '9.0';

const FFMPEG_RELEASE_TAG = 'latest';

const FFMPEG_WINDOWS_ASSET = 'ffmpeg-n9.0-latest-win64-lgpl-9.0.zip';

const FFMPEG_RELEASE_API = 'https://api.github.com/repos/BtbN/FFmpeg-Builds/releases/tags';

const SHA256_PREFIX = 'sha256:';

const FFMPEG_LINUX_HINT = msg('msu:ffmpeg.hint.linux');

const FFMPEG_OTHER_HINT = msg('msu:ffmpeg.hint.other');

const PROBE_TIMEOUT_MS = 30_000;

const PROBE_ARGS = ['-v', 'quiet', '-print_format', 'json', '-show_format', '-show_streams'];

export {
  FFMPEG_LINUX_HINT, FFMPEG_OTHER_HINT, FFMPEG_RELEASE_API, FFMPEG_RELEASE_TAG, FFMPEG_VERSION,
  FFMPEG_WINDOWS_ASSET, PROBE_ARGS, PROBE_TIMEOUT_MS, SHA256_PREFIX,
};
