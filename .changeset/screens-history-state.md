---
'@drizztdourden08/brock-react': minor
---

Hubs keep a page history. The window header shows Back while there is a step to go back to, Alt+Left and the mouse Back button go back too, and Escape goes back one step before it closes the hub. Each hub keeps its page and history while another hub is open, and opening it by its id brings it back where it was. `useScreenState(key, initial)` gives every screen and page a state that outlives it, kept per profile in `ui-views.json` under `screens` with the open hub, page and history, which come back after a restart. `useNavigation()` adds `back`, and `nav` adds `back`, `up` and `escape`; `useCanGoBack()` reads whether Back would do something.
