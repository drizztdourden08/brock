---
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-core": patch
---

`brock package` builds the small Windows installer, a downloader that reads `install.json` from the latest release and installs the payload it names, and writes that manifest with the entries carried forward from the previous release. A routine release is the update package only; `--full` adds the payload and the directory zip. The product config takes an optional `accent`, used for the installer progress bar and the downloader.
