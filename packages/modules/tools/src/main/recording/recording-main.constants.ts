/* @layer electron-main @kind constants */
const SEGMENT = /^[A-Za-z0-9][A-Za-z0-9._-]{0,79}$/;
const VIDEO_FPS = '16';
const VIDEO_FILE = 'video.mp4';
const SAMPLES_FILE = 'samples.jsonl';
const MANIFEST_FILE = 'manifest.json';
const FRAME_PATTERN = 'frame_%04d.png';

export { SEGMENT, VIDEO_FPS, VIDEO_FILE, SAMPLES_FILE, MANIFEST_FILE, FRAME_PATTERN };
