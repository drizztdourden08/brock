---
'@drizztdourden08/brock-input': minor
---

Add `--input-live`: it turns SDL3 on in a headless automation launch, so a pad can be checked without a window. It stays off by default and refuses, with one warning, while another running instance holds the pad (a lock file in the OS temp folder).
