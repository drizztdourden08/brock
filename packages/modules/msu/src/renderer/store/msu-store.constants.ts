/* @layer renderer-shell @kind constants */
const MSU_TRACK_PATTERN = /\.(pcm|opuz|msu)$/i;
const NO_TRACKS_ERROR = 'No audio tracks (.pcm/.opuz/.msu) found in the source. This may be a patch file, not an MSU audio pack.';
const DEFAULT_PACK_FILE_NAME = 'pack.zip';

export { DEFAULT_PACK_FILE_NAME, MSU_TRACK_PATTERN, NO_TRACKS_ERROR };
