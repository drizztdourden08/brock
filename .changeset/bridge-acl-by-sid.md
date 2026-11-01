---
'@drizztdourden08/brock-electron': patch
---

The bridge discovery file check now compares the owner and every access entry by SID. It reads them with `GetNamedSecurityInfoW` through `koffi` and no longer parses account names from `icacls` or `dir /q` text. This fixes false refusals for long account names, localized accounts and elevated apps whose files are owned by Administrators. `icacls` is still used to set the access list when the file is written, never to read it. A file name with spaces or symbols no longer needs special handling.
