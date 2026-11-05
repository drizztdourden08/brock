---
'@drizztdourden08/brock-tools': minor
---

The tools module now records and encodes. A RecordingButton and useRecordingCapture hook sample frames and send them to the main process, which encodes a video when ffmpeg is installed, with an FfmpegInstallStep and FfmpegRequiredDialog for the install. Wrap the bug report transport with withSentTagging to stamp sent recordings with sentAt.
