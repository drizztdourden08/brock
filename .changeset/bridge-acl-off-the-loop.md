---
"@drizztdourden08/brock-electron": patch
---

Opening a bridge link on Windows no longer freezes the process for two seconds or more. The check that the discovery file is private to the user used to run PowerShell and block the event loop. It now runs off the loop, tries a quick check first (icacls for the access list, dir for the owner) and falls back to the full PowerShell check on any doubt. A file that was accepted and has not changed since is not checked again in the same process. The checks are as strict as before. New `readBridgeDiscoveryAsync` and `readAppLaunchAsync` exports from the bridge entry do the same without blocking; the sync ones still work.
