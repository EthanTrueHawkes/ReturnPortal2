# Resolve return-portal prototype

Functional React/TypeScript prototype of the read-only [AI Work Figma flow](https://www.figma.com/design/mIOLn6FgL9DrtoGVatfMuG/Resolve---Return-Portal?node-id=399-12699).

## Run

```sh
npm install
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). The preview targets iPhone 15 Plus at 430 × 932 CSS pixels and scrolls longer screens within it. On phones it fills the actual browser viewport, adapting to Safari’s toolbar height; mobile inputs use 16px text to avoid focus zoom. The server binds locally and requires port 5173 to be available. Any nonempty email or phone opens the sample order. Refresh starts a new test.

## Verify

```sh
npm run lint
npm test
npm run build
node scripts/audit-assets.mjs
```

## Flow behavior

- Each returned item receives exactly one offer: fit issues use the adapted size exchange, changed mind uses the keep-item offer, and other reasons—including both Other options—use shopping.
- Accepting a size exchange goes directly to location selection. Declining goes through photos, then location selection without a second offer.
- Changed mind goes through the photo step before the keep-item offer. Keeping goes to review; declining goes to location selection.
- The camera uses the original Figma photos. Capture proceeds front → back; a retake replaces only the selected side and returns to review.
- Every displayed catalog product uses the shared detail layout. Adding a product replaces that return flow’s previous shopping selection. Refund clears the selection and shopping bonus.
- All providers work with sample details. Pickup requires one of the six designed slots. Choices that would leave a balance due are unavailable.
- Return another item preserves existing selections as read-only and starts a fresh return flow with its own offer eligibility.
- Confirm shows confetti and a thank-you screen, then clears state and returns to section 1 after five seconds.

## Demo calculations

Return prices and replacement prices come from the selected products. Shopping exchanges receive a 10% bonus; keep-item refunds are 20%. Fully refunded items receive a fixed $3.52 tax refund. Same-item size exchanges have no bonus or tax refund. The selected pickup fee is deducted once for the combined return. Amounts round to cents. No real payment, refund, camera, account, or shipping service is connected.

## Source organization

- `src/App.tsx`: lightweight flow navigation and per-item state.
- `src/design-system/tokens`: extracted colors, spacing, radii, shadows, and text styles.
- `src/design-system/components`: buttons, header/status bar, search, sizes, swatches, item cards, and return sheet.
- `src/EntrySections.tsx`, `FlowSections.tsx`, `Shopping.tsx`, `Locations.tsx`, `Review.tsx`: flow sections.
- `src/calculation.ts`: agreed demo math; `tests/flow.test.mjs` covers totals and fresh-flow state.
- `public/assets`: downloaded original Figma images/SVGs. Runtime uses local assets and local Inter fonts.
- `.design-reference`: original design-context responses, prototype connections, and per-screen asset manifest.
- `prototype-decisions.md`: confirmed behavior and scope.
- `design-discrepancies.md`: minor visual/data limitations and approved adaptations.
- `qa`: browser verification notes and screenshots.
