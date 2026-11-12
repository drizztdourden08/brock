---
'@drizztdourden08/brock-input': patch
---

The Controls binding listener cancels on Escape by `key` or `code`, clears on `key` Delete or Backspace, and ignores a key with an empty `code`. Android WebView sends Escape with an empty code, which used to save an empty keyboard binding.
