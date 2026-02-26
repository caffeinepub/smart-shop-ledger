# Specification

## Summary
**Goal:** Full rebuild of Smart Shop Ledger frontend covering toast notifications, ad banners, premium section/modal redesign, app-wide language-aware UI, and a new splash screen logo.

**Planned changes:**
- **Toast notifications:** Fix in-app toast so it appears after any task or trust completion, slides in from the top, displays the app logo and a relevant message, auto-dismisses after 3 seconds, supports click-to-dismiss, and renders text in the active language (Bengali or English)
- **Home page ad banner:** Add a fixed ad banner above the bottom nav bar on the Home screen, visible only to non-premium users, always visible and never auto-dismissed
- **History page ad banner:** Add a fixed ad banner at the bottom of the History page; history entries stack upward above it as they grow; visible only to non-premium users, always visible
- **Premium card redesign (Settings page):** Redesign the premium card to show crown icon + "Premium" title, subtitle, free/premium limit line, 7-item feature checklist, full-width "Get Premium" button, and replace the "Buy" button with a styled offer tag "🔥 অফার! ১০০ টাকায় ১ বছর" (English equivalent when English is active); clicking the offer tag silently copies `mdjahidhasanrubel73@gmail.com` to clipboard
- **Premium modal redesign:** Redesign to dark background with gold accents, crown emoji + "Premium" title, close button, 7-item checklist, 1-year info box, "Promo Code" / "Purchase Code" tabs, code input, orange "Activate" button; valid promo codes: `987987` and `789789`; valid purchase code: `RUBELBOSS987`; email icon copies `mdjahidhasanrubel73@gmail.com` and opens mailto link; "Trial" button grants 1 minute of premium access, usable only once per device (tracked in localStorage), permanently disabled after first use; show CongratulationsAnimation on successful activation
- **Language-aware UI:** Ensure all pages, modals, buttons, labels, placeholders, and error messages render in Bengali or English based on the active language selection using the existing LanguageContext and translations.ts; add all missing translation keys for new UI elements (offer tag, trial button, email copy feedback, etc.)
- **Splash screen logo:** Replace the current splash screen logo in SplashScreen.tsx with the new `ssl-logo.dim_512x512.png` asset; keep all splash animation timing (2.5 seconds) unchanged

**User-visible outcome:** Users see polished toast notifications on task/trust completion, ad banners on Home and History pages (non-premium only), a fully redesigned premium card and modal with offer tag, promo/purchase code activation, a one-time trial option, language-responsive UI throughout the entire app, and a new green-themed Smart Shop Ledger logo on the splash screen.
