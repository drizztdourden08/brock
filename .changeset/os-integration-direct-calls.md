---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-build': minor
---

The OS integration makes direct Windows calls and no longer runs `reg.exe` or PowerShell. File associations and protocols are written and removed in process through `koffi` (`RegCreateKeyExW`, `RegSetValueExW`, `RegDeleteTreeW`, `RegDeleteKeyValueW`), and Explorer is told with `SHChangeNotify`, so antivirus no longer sees a child process in the install, update and uninstall hooks. The bridge discovery file check uses `icacls` only and refuses the link with a reason when `icacls` is missing or unsure. `koffi` is a dependency of `brock-electron` and of the app template: an existing app adds `"koffi": "catalog:"` (or `^3.1.2`) to its `dependencies`. `brock package` unpacks `koffi` from the asar.
