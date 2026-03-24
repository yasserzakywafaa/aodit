# URL Segmentation Cleanup Follow-up

This file documents legacy paths and compatibility code intentionally kept during the initial URL segmentation rollout. Remove these items in a follow-up release after the new URLs are stable.

## Legacy Routes To Remove

- `routes.compliance.finma` (`/compliance/finma`) alias after migration window
- `routes.compliance.euAiAct` (`/compliance/eu-ai-act`) if no longer part of public IA
- `routes.pricing` and `routes.howItWorks` if no longer used in navbar/SEO strategy

## Router Cleanup Targets

- `client/src/application/AppContent.tsx`
  - Remove `<Route path={routes.compliance.finma} ... />` legacy alias
  - Remove `<Route path={routes.compliance.euAiAct} ... />` if deprecated
  - Evaluate whether auth pages (`/login`, `/register`) should stay indexed

## Page Cleanup Candidates

- `client/src/Pages/Compliance/EuAiAct/ComplianceEuAiAct.tsx` if EU page is out of scope for current IA
- `client/src/Pages/Pricing/Pricing.tsx` if no longer part of acquisition funnel
- Old feature section components no longer mounted by homepage:
  - `client/src/Pages/Features/features/Hero.tsx`
  - `client/src/Pages/Features/features/ReportsSection.tsx`
  - `client/src/Pages/Features/features/DownloadReportSection.tsx`
  - `client/src/Pages/Features/features/SubscribeSection.tsx`
  - `client/src/Pages/Features/features/AboutSection.tsx`
  - `client/src/Pages/Features/features/MethodologySection.tsx`
  - `client/src/Pages/Features/features/ComplianceLogosSection.tsx`
  - `client/src/Pages/Features/features/ContactSection.tsx`

## SEO Cleanup Targets

- Remove legacy URL from sitemap:
  - `https://www.aodit.ai/compliance/finma`
- Remove obsolete structured-data copy still tied to deprecated positioning
- Add explicit old-to-new redirect mapping at infra level (301) for:
  - `/compliance/finma` -> `/finma-ai-guidance-switzerland`
  - Any removed hash-section links on `/`

## Validation Checklist For Cleanup Release

- Confirm no internal links reference removed paths
- Confirm Google Search Console coverage for new canonical URLs
- Confirm redirect map has no chains and no loops
- Rebuild and verify all public URLs still resolve
