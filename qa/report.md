# Prototype QA — October 21, 2026

Verified in the Codex in-app browser against the Figma screenshots. The source Figma page remained read-only.

## Automated checks

- `npm run lint`: passes without warnings.
- `npm test`: seven checks pass (fresh-flow state, full refund, free size exchange, keep-item refund, shopping bonus/price, shared pickup fee, unaffordable combination).
- `npm run build`: production build passes.
- `node scripts/audit-assets.mjs`: 67 referenced originals exist and are nonempty; all 80 downloaded originals are nonempty; no temporary Figma runtime URLs.

## Browser paths checked

- Email and phone lookup; product-name/color search; expired item unavailable.
- Front/back capture, success banners, photo review, and individual front retake preserving the back photo.
- Shopping search, multiple product detail pages, required size selections, cart badge, and replacing a previous product.
- $79.50 return exchanged for a $90 dress: free pickup gives $0.97 back. The $5 pickup is disabled even after choosing a slot, with explanatory copy.
- All provider cards expand; sample drop-off map crop/address overlay and provider-specific requirements match the designed templates. Pickup requires a slot and carries it to review.
- Return another item preserves prior Returning cards as read-only. A second item gets a fresh size offer with adapted “smaller” copy and recommended size.
- Declining a size offer reaches photos and then locations, without showing shopping.
- Accepting a longer-size offer skips photos and reaches locations. The chosen Dark Wash color and 26/31 size appear in review; the exchange total is $0.
- Both Other options route to shopping. Choosing Refund after adding a product removes that cart item and the exchange bonus. A combined free size exchange and full refund with USPS pickup totals $78.02.
- Changed mind reaches photos before the keep offer. Declining goes directly to locations; accepting goes directly to review with the 20% refund.
- Mixed shopping/refund/keep returns preserve the individual outcomes. Verified combined example total: $109.19.
- Keep-only review shows $15.90 back with no Receiving, Exchange delivery, or Return location sections.
- Confirm shows the thank-you screen with confetti. With no source changes or navigation during the timer, it automatically returns to a cleared entry screen after the five-second timeout.

## Saved visual evidence

- `entry.png`: clean entry screen, left open as the deliverable.
- `keep-only-review.png`: partial refund without physical-return sections.
- `thank-you.png`: completion screen with visible confetti.

Minor browser/data limitations and approved template adaptations are recorded in `design-discrepancies.md`.

## Sheet-motion revision

- Reason heading descenders paint outside the trimmed text box without changing layout spacing.
- The item banner stays mounted independently of the changing sheet pages. Browser measurements confirmed identical position and height before and after fit → size navigation.
- New sheet page bodies and footers use a quick upward entrance; the banner only animates its progress width. Front/back camera changes replay the content entrance as well.
- Reason-menu collapse/expand remains an in-place transition. Reduced-motion preferences disable page animation and progress transitions.
- Lint and production build pass after the revision.
