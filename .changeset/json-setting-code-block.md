---
'@drizztdourden08/brock-react': patch
---

The `json` settings control draws Tessera's `CodeBlock` with `editable` and `language="json"`, since JsonInput is gone. Each edit goes through `JSON.parse` and the `shape` check; the parsed value is saved only while the text parses, and otherwise the field is marked invalid, the line read from the parse message is tinted, and the message shows under the field. `shape` keeps its values, now typed `SettingJsonShape`.
