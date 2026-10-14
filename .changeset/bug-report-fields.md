---
'@drizztdourden08/brock-core': minor
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-react': minor
---

The bug report dialog can ask for a contact email and take attachments, and show the receipt after it sent. `<BrockApp bugReport={{ contact, attachments, afterSend }}>` turns them on, with or without a renderer transport of its own; the email is checked, the files are held to a count and a size, and both reach `BugReportPayload` as `contact` and `attachments` when the report goes through a transport. `afterSend: 'view'` shows the message, the report id and an Open button in the dialog instead of a toast. `writeDebugZip` writes the attachments under `attachments/`.
