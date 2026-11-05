/* @layer renderer-shell @kind logic */

const soundPreviewKey = (channel: string, soundId: number): string =>
  `sound:${channel}:${soundId}`;

export { soundPreviewKey };
