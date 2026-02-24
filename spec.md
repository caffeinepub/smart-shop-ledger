# Specification

## Summary
**Goal:** Redesign the sound toggle button in Settings, add new premium access codes, and introduce a language-aware unit selector for quantity fields in AddSale and ProductList pages.

**Planned changes:**
- Replace the existing sound toggle button UI in the Settings page with a new design featuring a speaker/sound icon, while preserving toggle and custom sound upload functionality
- Add 4 new premium access codes to PremiumModal.tsx (replacing previously planned codes 987789 and 879987), keeping the original code 987987 valid; all 5 codes grant full premium access
- Add a unit selector icon next to quantity input fields in AddSale and ProductList pages; clicking it opens a dropdown with gram, kg, and liter options
- Unit dropdown labels switch between English (gram, kg, liter) and Bengali (গ্রাম, কেজি, লিটার) based on the active app language via existing LanguageContext
- Store the selected unit alongside the quantity value
- Add English and Bengali translation keys for gram, kg, and liter to translations.ts

**User-visible outcome:** Users see a redesigned sound button in Settings, can unlock premium with additional codes, and can select a unit (gram/kg/liter) next to quantity fields with labels matching the current app language.
