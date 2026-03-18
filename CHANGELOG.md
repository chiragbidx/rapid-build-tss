## [2026-06-07] FAQ Section TypeScript Fix

- Fixed TypeScript error in `components/home/LayoutFaqSection.tsx` by explicitly typing mapped FAQ items as `{ question: string; answer: string }`.
- Ensures build passes and type safety is preserved for FAQ rendering.