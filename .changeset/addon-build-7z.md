---
"@drizztdourden08/brock-input": patch
---

The Windows addon build unpacks libusb with 7-Zip instead of tar, and skips the download when native/third_party already holds the pinned libusb version.
