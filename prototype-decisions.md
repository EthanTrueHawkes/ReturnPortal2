# Confirmed prototype decisions

Source: Figma file `mIOLn6FgL9DrtoGVatfMuG`, AI Work page `399:12699`. The source page remains read-only.

## Entry and item selection

- Any nonempty email or phone opens the sample order.
- Gift returns, alternate lookup, language selection, Privacy Policy, and Policy are outside scope.
- Search filters the sample products. Existing Returning cards are read-only. Expired items cannot be selected.

## Exactly one offer per return flow

| Reason | Offer | Acceptance | Decline |
| --- | --- | --- | --- |
| Too small / big / short / long | Adapted size exchange, 3.2–3.3 | Location selection, 7 | Photos, then 7; no shopping offer |
| Changed my mind | Keep-item offer, 6 alternate, after photos | Partial-refund review, 8 | Full return via 7 |
| Every other reason, including both Other options | Shopping, 6.x, after photos | Location selection, 7 | Location selection, 7 |

Return another item starts a fresh flow with its own offer eligibility and preserves the previous return.

## Photos

- Take photos or either empty tile starts front → back capture.
- Camera viewports use the original design photos; no real camera access.
- Retakes replace only the selected side and preserve the other photo.
- Brief success banners match the Figma sequence. The error screen marked Future work is excluded.

## Shopping

- All catalog products reuse the designed detail layout, their own supplied image/name/price, and sample size/color options.
- One shopping replacement per returned item. A new addition replaces the previous selection.
- Refund clears that flow’s cart selection and bonus. Both continuations pass through 7.
- Catalog search works. Cart drawer and exchange-value disclosure have no designed destinations and remain outside scope.

## Locations

- Every listed provider is selectable by adapting the two expanded UPS layouts with the supplied sample map/address/hours.
- USPS Pickup keeps its $5 fee and No Label requirement.
- Pickup requires one of the six Today/Tomorrow slots and carries that selection into review.
- ZIP editing, See more times, and extra hours/instructions disclosures are outside scope.
- A pickup fee that would leave a balance due is waived in full for this prototype; the provider displays Free and remains selectable after choosing a pickup slot.

## Review and completion

- Prices and totals adapt to selections: 10% shopping bonus, 20% keep-item refund, $3.52 tax per fully refunded item, selected pickup fee deducted once.
- Same-item size exchanges are free, with no shopping bonus or tax refund.
- Keep-only review omits physical-return location, shipping, and receiving sections.
- Changing return location and adding another return work. Refund-card/address changes and information popovers are outside scope.
- Confirm opens the requested thank-you screen with confetti. After five seconds it clears selections and returns to section 1.

## Prototype device

- iPhone 15 Plus is the primary test device (430 × 932 CSS pixels). Desktop uses that frame; phones fill the available browser viewport as Safari toolbars resize. Mobile input text is 16px to avoid focus zoom.

- Remove the simulated system status bar throughout the prototype and position sheets 12px below the browser content edge. The real iPhone status bar remains managed by iOS.
