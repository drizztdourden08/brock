/* @layer electron-main @kind constants */
const CONNECTED_LINE = /^(\S+)\s+connected\s+(?:primary\s+)?(\d+x\d+)/;
const MODE_LINE = /^\s+(\d+x\d+)\s+(.*)$/;
const XRANDR_TIMEOUT_MS = 4000;
const WAYLAND_REASON = 'xrandr could not read this display, which usually means a Wayland session.';

export { CONNECTED_LINE, MODE_LINE, XRANDR_TIMEOUT_MS, WAYLAND_REASON };
