# Specification

## Summary
**Goal:** Upgrade Smart Shop Ledger with AdMob ads, history fixes, bottom sheet list popups, color tags for sales, premium UI improvements, a today's sales popup, and an updated golden/green logo.

**Planned changes:**
- Integrate AdMob banner ad (App ID: `ca-app-pub-1425556101841688~8624741531`, Ad Unit ID: `ca-app-pub-1425556101841688/7582793038`) at the bottom of the Home page (above nav bar) and top of the History page; visible only to non-premium users
- Update the Facebook Page button link in Settings to `https://fb.openinapp.co/khncs`
- Fix History page summary to show two separate cards: "Today's Total Income" (sum of selling prices) and "Today's Net Profit" (income minus cost), both resetting at midnight with auto-save to history
- Redesign Shopping List and Task List cards on Home to open as bottom sheet popups (80% screen height) with slide-up animation; Task List supports tap-and-hold 2 seconds to complete (glow + confetti + bell sound + vibration); Shopping List supports swipe to mark as bought (fade-out + cash register sound); Whoosh sound on open, Soft Click on close; data persisted in localStorage
- Add 4 color tag options (🔴 Red, 🟡 Yellow, 🟢 Green, 🔵 Blue) to the Add Sale flow; save selected color with each sale; display per-color sale count on the Home screen's "রঙ বিভাজন" card
- Upgrade Premium modal UI: add a BUY button above each of the 3 plans that shows owner email with copy-to-clipboard, triggers bubble float-up animation + sound; show full-screen Congratulations animation on successful code activation; improve spacing and typography
- Add a tappable Today's Sales stats area on Home that opens a slide-up bottom sheet popup (70–80% height) listing all today's sales with product name, quantity, selling price, and a totals footer (Total Income + Net Profit)
- Update app logo/icons to use golden + green color scheme with a shopping basket/bag graphic, no black background; apply to splash screen, header logo, and favicon

**User-visible outcome:** Users see banner ads (non-premium), an improved History page with separate income and profit cards, interactive bottom sheet popups for lists, color-tagged sales with a breakdown on the Home screen, an upgraded premium purchase flow, a today's sales detail popup, and a refreshed golden-green logo throughout the app.
