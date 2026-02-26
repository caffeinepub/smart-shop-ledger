# Specification

## Summary
**Goal:** Fix dark mode persistence, revert the PremiumModal to its Version 27 design, and enforce premium locks on multiple features with a 199-item free tier cap.

**Planned changes:**
- Fix dark mode persistence by reading from and writing to localStorage in ThemeContext so the preference survives app restarts
- Revert PremiumModal visual design back to Version 27 style (layout, colors, card styles, typography, buttons) without changing promo code logic or plan pricing
- Lock color categorization (color tags) on the Home/AddSale screen for free users — tapping it opens the PremiumModal
- Lock "Task List" and "Product List" bottom navigation options for free users — tapping them opens the PremiumModal with a lock icon visible on these options
- Lock 3 specific color themes in Settings for free users with a lock icon — tapping a locked theme opens the PremiumModal; default theme remains free
- Enforce a 199-item cap per content type (sales, products, tasks, shopping list) for free users — the 200th add attempt shows the PremiumModal; show a remaining-slots indicator when approaching the limit
- Lock the custom sound upload option in Settings for free users with a lock icon — tapping it opens the PremiumModal
- Add a "Data Export" feature (CSV download of sales/product data) visible to all users but locked for free users via PremiumModal
- Add an "Advanced Statistics" section (weekly/monthly profit trends, top-selling products, best sales days) visible to all users but shown with a lock overlay for free users that opens the PremiumModal

**User-visible outcome:** Dark mode now persists across app restarts. The PremiumModal looks like the original Version 27 design. Free users see premium lock indicators on color categorization, Task List, Product List, 3 color themes, custom sound upload, data export, and advanced statistics — tapping any locked feature prompts the premium upgrade modal. Free users are also capped at 199 items per content type, with a counter shown near the limit.
