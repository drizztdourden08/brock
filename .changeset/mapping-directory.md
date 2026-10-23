---
'@drizztdourden08/brock-input': minor
---

`window.api.input.mapping.list()` returns every gamepad mapping SDL knows as `{ guid, name, vid, pid, platform?, family? }`, so an app can show a searchable directory of supported controllers. The vendor and product ids are decoded from the SDL GUID, the platform comes from the mapping line, and the family comes from the vendor or the name. Main parses the list once and clears it when a mapping is added. The addon adds a `mappingList` call and moves to version 1.3.0. With an older addon, with controllers off, or on Android, `list()` returns an empty list. See the mapping directory section of the module README.
