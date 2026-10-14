---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

The bug report takes a contact email and attachments. A renderer or main transport opts in with `contact: true` and `attachments: true | { maxFiles?, maxBytes? }`; the dialog then shows a Contact email field and a drop zone for files, capped at 5 files and 10 MB in all by default. The payload carries `contact` and `attachments` (`{ name, type, size, data }`), never into a public GitHub issue, and `writeDebugZip` stores each attachment under `attachments/` with only its name, type and size in `report.json`.
