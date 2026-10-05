---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Toasts go through Tessera's one queue. `ToastHost` is a single `ToastStack` at the bottom right with `max={3}`, and `toast(message, { variant, duration, action })` and `dismissToast(id)` are thin wrappers over Tessera's `toast()` and `toast.dismiss()`. The same message and variant raised again joins the toast already shown, with a count such as ×2, and a toast with no `duration` leaves after Tessera's 5 s, where Brock's own default was 4 s. `useToastStore` and `ToastState` are removed: the 0.25.0 migration `toast-store-gone` lists each use as a to-do.
