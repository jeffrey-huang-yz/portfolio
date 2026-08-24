# Worklog

## 2026-08-22

- Audited the React/Sanity structure, current portfolio sections, dependencies, assets, and responsive styles.
- Recorded and preserved the existing uncommitted `Header.jsx` fixes and generated build output.
- Chose a lightweight field-notebook journey as the working design direction: editorial page sections, a visible path/progress rail, restrained page-edge reveals, native scrolling, and direct section navigation.
- Confirmed the existing stack already has the needed motion primitives; no TanStack or Tailwind dependency is justified.
- Flagged the client-exposed Sanity write token and large PNG assets for remediation.
- Next: inspect the live data/render, finalize design tokens, implement the semantic redesign, optimize assets, and run responsive/accessibility checks.

## 2026-08-22 · Book interaction pass

- Reframed the portfolio as five physical book spreads: cover, profile, selected work, toolkit, and colophon.
- Added a shared scroll-linked `BookPage` primitive. It reads native section progress and rotates the spread without listening for or cancelling wheel events.
- Added ordinary previous/next hash links along both page edges, with hover/focus corner folds and accessible page labels.
- Replaced the colorful system with carbon ink, graphite, white interface chrome, and warm traditional paper; dark mode now changes the surrounding desk and chrome while preserving the paper surface.
- Added CSS-only ink-drop hover/focus inversions so the interaction does not add image, canvas, or JavaScript asset cost.
- Converted the portrait and project previews to monochrome presentation while preserving the optimized AVIF/WebP sources.
- Next: compile, resolve styling or lint issues, then test page motion, edge navigation, hover states, reduced motion, and responsive layouts.
- Production build completed successfully at 110.86 kB JavaScript and 6.44 kB CSS gzipped; the page system added no dependency.
- Browser QA covered 1440×1000, 820×1180, 390×844, and 320×568. All tested layouts had zero horizontal overflow, one semantic H1/main, five book spreads, nine accessible page-turn links, and no console warnings or errors.
- Verified native wheel continuity with an exact 520 px scroll delta, visible outgoing-page rotation, reversible scroll-linked transforms, clickable hash page turns, ink inversion, corner folds, mobile menu focus restoration, manual dark mode, automatic mode, and warm-paper persistence.
- Fixed a QA-discovered image regression: live Sanity data now preserves bundled project image slugs, so known projects select local responsive AVIF/WebP/JPEG sources instead of reverting to remote CDN images.
- Final build and `git diff --check` passed. The test runner reports no test files and exits cleanly with `--passWithNoTests`; the only build notice is the repository’s stale Browserslist database.

## 2026-08-22 · Unified page stack

- Refactored `BookPage` so the physical book stays planted while only the top paper surface rotates; the earlier version moved the page, shadow, and implied stack as one card.
- Added a black cover and progressively fewer warm-paper sheets beneath each chapter. The cover starts with four remaining leaves and the colophon ends directly on the cover.
- Added quiet `01 / 05` through `05 / 05` folio marks to make the physical sequence legible without adding another navigation control.
- Replaced linear page-turn segments with smoothstep interpolation and a lightly damped Framer Motion spring. Rotation was reduced from 66° to 56° and fade from 55% to 12% so content turns like opaque paper instead of disappearing.
- Removed `content-visibility` intrinsic-size approximation from the five large sections; the small DOM did not justify geometry changing near a scroll-linked transition.
- Production build succeeds at 111.35 kB JavaScript and 6.62 kB CSS gzipped. Next: visually inspect stack depth and motion at desktop, tablet, and phone sizes.
- Tightened chapter gutters from roughly 156 px to 54 px at the desktop transition so consecutive leaves read as one continuous book rather than separate cards.
- Increased the physical page-block depth to 19 px on tablet and 13 px on phone, with a faint warm keyline so the black cover remains visible against the automatic dark grid.
- Browser QA passed at 1440×1000, 820×1180, 390×844, and 320×568 with zero horizontal overflow, broken visible images, or console warnings/errors.
- Equal 35 px native scroll steps produced a smooth monotonic outgoing sequence of −12.38°, −17.48°, −23.63°, −31.09°, −38.07°, and −44.66°, while the cover remained untransformed.
- Verified responsive page depth, single-leaf mobile presentation, decreasing sheet counts, folio labels, and previous/next hash navigation. Final build is 111.35 kB JS and 6.64 kB CSS gzipped; tests pass with the repository’s empty-suite flag.

## 2026-08-22 · Shared bound cover

- Superseded the per-chapter cover approach after feedback that the chapters still read as separate books.
- Added one semantic-adjacent decorative `.book-cover` div beneath the complete `.book-pages` deck, with a shared spine and page-block edge.
- Gave consecutive chapter wrappers increasing stacking order and a short overlapping runway. Each leaf scrolls normally while being read, then briefly sticks at the bottom as the next leaf arrives above it.
- Kept all wheel input native: the implementation uses CSS sticky positioning and observed scroll progress, with no wheel handler, snapping, internal scroll area, or cancelled browser event.
- Added subtle Z-axis lift, spring-smoothed rotation, and a motion-linked paper shadow to make the top leaf feel less like a flat card.
- Production build succeeds at 111.45 kB JavaScript and 6.96 kB CSS gzipped. Next: visually verify the shared cover and overlap behavior across breakpoints.
- Corrected the chapter overlap rule after browser inspection showed each section's `margin: 0 auto` shorthand was overriding the generic negative top margin. The higher-specificity deck selector now produces measurable physical overlap rather than only a reduced gutter.
- Final browser QA confirms one shared cover, zero repeated chapter covers, and overlapping leaves at 1440×1000, 820×1180, 390×844, and 320×568, with no horizontal overflow or broken images. The overlap measures 198 px at tablet width and 100 px at both phone widths.
- Verified that the last project remains fully readable within normal document flow, the shared cover never transforms, the page-edge anchor reaches the next chapter, and equal 35 px scroll steps yield a smooth monotonic 21.94° → 6.37° settling sequence with a matching receding shadow.
- Final optimized build succeeds at 111.45 kB JavaScript and 6.98 kB CSS gzipped. The empty test suite exits successfully with `--passWithNoTests`, `git diff --check` passes, and the source contains no wheel handler, scroll snapping, or nested vertical scroller.

## 2026-08-22 · Continuous paper scrapbook

- Superseded the literal book after feedback that the physical stacking and curl were taking attention away from the portfolio. Removed the shared cover, deck, curl panels, page markers, hidden inactive leaves, and page-edge controls.
- Returned all five chapters to normal semantic document flow with the real `home`, `about`, `work`, `skills`, and `contact` IDs. The fixed navigation now observes those sections directly.
- Added one uninterrupted warm-paper wrapper with torn side edges, subtle fibers, margin notes, and a responsive monochrome desk grid. Each chapter is a taped clipping with an ink-stamped sequence marker rather than a separate page.
- Added a single lightweight SVG route. Framer Motion maps native document progress to the path length through a small spring; it adds no wheel listener, scroll cancellation, nested scroller, canvas, bitmap texture, or dependency. Reduced-motion users receive the completed route immediately.
- Recast the work area as a contact sheet and the contact chapter as a note, while preserving the portfolio's content, filtering, CMS hydration, responsive images, direct actions, theme control, navbar, and draggable progress range.
- The final optimized build succeeds at 110.87 kB JavaScript and 6.84 kB CSS gzipped, both smaller than the shared-book revision. The empty test suite exits successfully with `--passWithNoTests`; `git diff --check` reports only the repository's line-ending notices.
- Browser QA covered 1440×1000, 820×1180, 390×844, and 320×568 with no horizontal overflow or broken images. It found exactly five paper clippings, one SVG route, no book layers, one H1, five H2s, no unnamed links/buttons, and no nested vertical scroller.
- A requested 520 px native wheel gesture moved the document 518 px, section hash navigation and active labels stayed synchronized, and the contact chapter remained reachable at the natural document end. The only build notice remains the stale Browserslist database.

## 2026-08-22 · Tapered brush route

- Replaced the uniform 2.2 px progress line with six connected brush segments that taper from 13.5 px at the start to 1.8 px at the finish, making the top-to-bottom direction immediately legible.
- Kept one animated reveal path inside an SVG mask and made the visible brush geometry static. This preserves the existing native-scroll behavior while avoiding eighteen independently animated texture layers.
- Added a slightly displaced translucent ink edge and sparse same-color bristle marks outside the core stroke. An initial paper-colored center scratch was removed during visual review because it resembled a road marking rather than dry paint.
- Production build succeeds at 111.27 kB JavaScript and 6.91 kB CSS gzipped. Browser checks at 1440×1000 and 390×844 confirm the 13.5 → 1.8 px taper, progressive mask reveal, zero horizontal overflow, and no broken images; the empty test suite exits cleanly.

## 2026-08-23 · Independent chapter strokes

- Replaced the single page-height route with four independent `PaintDivider` components inserted between the five real portfolio chapters. Their positions now follow document layout and CMS-driven section heights instead of relying on percentages of one stretched SVG.
- Raised each divider to z-index 4 inside the paper content stack so the ink remains clearly visible above the paper and clipping edges. The SVGs remain decorative, hidden from assistive technology, and `pointer-events: none`.
- Gave every transition its own alternating left-to-right or right-to-left gesture, tapering from roughly 10.5–12 px of loaded ink to 1.6–1.8 px at the finish.
- Removed the global progress spring. Each reveal reads raw `useScroll` progress over a compact viewport interval, so wheel and touch movement update it on the same animation frame without a settling tail.
- Browser review caught that a normalized animated path mask could render as dash islands at full progress. Replaced it with a direction-aware animated rectangle plus rounded leading ellipse, restoring one uninterrupted swipe per divider.
- Scroll samples advanced directly from 0% to 36.7%, 85%, and 100% as the first divider crossed its reveal interval. Desktop and 390×844 mobile checks show one visible divider per transition, four total dividers, no horizontal overflow, and no broken images.
- Final production build succeeds at 111.56 kB JavaScript and 6.96 kB CSS gzipped. The empty test suite exits cleanly; the stale Browserslist notice remains non-blocking.

## 2026-08-23 · Curved continuous tapers

- Corrected feedback that the independent marks still looked like horizontal rules and that their three stroke-width stages produced visible thick-to-thin joints.
- Rebuilt each transition as one closed, filled Bézier ribbon rather than several stroked centerlines. The two outline curves now converge continuously from a broad loaded-brush edge to one exact pointed endpoint.
- Changed the divider canvas from a wide 100×24 strip to a compact 100×100 path space with preserved aspect ratio. Four alternating diagonal and S-curved shapes now move through the vertical transition gutter instead of spanning it horizontally.
- Reoriented each mask reveal from horizontal width to vertical height and added a small leading ellipse whose x-position follows the connector curve. The raw scroll source remains unchanged and spring-free.
- Browser samples advanced the first connector directly through 0%, 12%, 63%, and 100% height as it crossed the viewport. Desktop and 390×844 checks confirm the curved silhouette, continuous taper, four independent dividers, zero horizontal overflow, and zero broken images.
- Final production build succeeds at 111.46 kB JavaScript and 6.93 kB CSS gzipped. The empty test suite exits cleanly; only the existing stale Browserslist notice remains.

## 2026-08-23 · One continuous variable-width route

- Superseded the four chapter dividers with one page-height paint route inside `PaperJourney`. The visible mark is a single closed Bézier ribbon, so its two edges can separate and converge smoothly instead of changing `stroke-width` in steps.
- Routed the desktop line down alternating paper margins and across the open chapter gutters. The silhouette repeatedly moves between fine and ink-loaded widths through the sections rather than following one uniform taper.
- Replaced the height rectangle/leading ellipse reveal with a second centerline Bézier used as an SVG mask. Scroll progress now paints along the curve itself, eliminating the clipped rectangular front seen during diagonal transitions.
- Kept the animation spring-free and driven directly by Framer Motion's raw `useScroll` value. No wheel listener, scroll cancellation, snapping, canvas, image asset, or new dependency was added.
- Added a responsive version of the same continuous route for compact screens. It stays in the left paper margin and varies organically in width because the narrow chapter gaps cannot safely contain a full-width crossing without covering project copy.
- Browser QA at 1440×1000 and 390×844 confirmed the appropriate desktop/mobile route, rounded in-progress reveal, clear width changes, zero horizontal overflow, zero broken images, and safe clearance from the work and contact headings.
- Final production build succeeds at 112.08 kB JavaScript and 6.89 kB CSS gzipped. The empty test suite exits cleanly and `git diff --check` reports only the repository's existing line-ending notices; the stale Browserslist notice remains non-blocking.

## 2026-08-23 · Original route and perforated paper

- Restored the continuous-paper route's original visual hierarchy: one uniform 2.2 px progress line over a faint 1.1 px dashed guide. Removed the filled ribbons, duplicate edge layers, masks, and breakpoint-specific route variants.
- Returned the route to z-index 1 behind the scrapbook clippings, with the real section content at z-index 2. The path is visible in paper margins and transition gaps without drawing across readable copy.
- Kept the later raw `useScroll` response instead of restoring the early spring, preserving immediate native-scroll tracking and avoiding the delay that prompted earlier feedback. Reduced-motion users still receive the completed route.
- Replaced the torn side masks with CSS-only continuous-feed perforations: two repeating punched-hole rails, each paired with a subtle dashed tear line. The holes use the current backdrop color, so they read as openings in both automatic light and dark themes.
- Browser QA at 1440×1000 and 390×844 confirms exactly one guide/progress route pair, no former brush layers, legible perforations, zero horizontal overflow, and zero broken images.
- Final production build succeeds at 110.73 kB JavaScript and 6.52 kB CSS gzipped, reducing the previous revision by 1.36 kB JS and 362 B CSS. The empty test suite passes; only stale Browserslist and existing line-ending notices remain non-blocking.

## 2026-08-23 · Natural route and torn paper

- Removed the continuous-feed perforation rails, radial gradients, dashed tear lines, and their mobile sizing override. Restored the earlier irregular clipped paper edges on both sides of the full journey.
- Kept the thin solid-over-dashed route treatment, raw native-scroll progress, reduced-motion behavior, and behind-content layer unchanged.
- Redrew the route as nine joined cubic Bézier arcs. Consecutive control handles continue in the same direction at every anchor, producing long S-curves instead of short lateral turns and nearly straight margin runs.
- Browser QA at 1440×1000 inspected the opening line and all three main chapter bends; 390×844 checks covered the opening and first mobile bend. The route remains behind text, the torn edges are restored, and there is no perforation gradient, horizontal overflow, or broken image.
- Final production build succeeds at 110.63 kB JavaScript and 6.87 kB CSS gzipped. The empty test suite passes and `git diff --check` reports only the existing line-ending notices; stale Browserslist data remains non-blocking.

## 2026-08-23 · Numbered route waypoints

- Converted the five `data-scrap` CSS pseudo-element stamps into equivalent decorative `.paper-panel__scrap` elements so their centers can serve as real responsive route waypoints. Accessibility remains unchanged because every stamp is `aria-hidden`.
- `PaperJourney` now measures the stamp centers relative to the continuous paper and generates the SVG path through those exact normalized coordinates. Measurements run on initial layout and `ResizeObserver` updates only—never during scrolling.
- Joined every pair of waypoints with one cubic Bézier whose handles remain vertical at both ends. This keeps the line tangent-continuous as it enters 01–05 and produces broad natural S-curves between alternating edges.
- Added a short vertical line inside each stamp behind a paper-backed number label, visually continuing the route through the circle without reducing label legibility.
- Kept desktop stamps in their established left/right pattern. On phones, alternated stamps safely inside the opposite edge from each tape strip, preserving both the curve and zero-overflow layout.
- Browser measurements at 1440×1000 and 390×844 confirm all five marker coordinates are encoded verbatim as route endpoints. Visual checks sampled 01–03 on desktop and 01–02 on mobile; no horizontal overflow or broken images were found.
- Final production build succeeds at 110.96 kB JavaScript and 6.94 kB CSS gzipped. The empty test suite passes and `git diff --check` reports only existing line-ending notices; stale Browserslist data remains non-blocking.

## 2026-08-23 · Route beneath the stamps

- Removed the decorative line previously redrawn inside each numbered stamp. The responsive SVG route and its measured stamp-center waypoints remain unchanged underneath.
- Removed the number label's separate paper backing because the complete stamp already has an opaque warm-paper fill. The circle now masks both the dashed guide and solid progress path cleanly from edge to edge.
- Desktop and 390×844 browser checks confirm the former pseudo-line computes to `content: none`, all five stamps retain opaque paper backgrounds, and the route remains curved around the same alternating waypoints with no horizontal overflow.
- Final production build succeeds at 110.96 kB JavaScript and 6.86 kB CSS gzipped. The empty test suite passes; nine offscreen lazy images remain intentionally unloaded during the initial viewport check, with zero genuinely broken images.

## 2026-08-23 · Viewport-locked route reveal

- Diagnosed the apparently misaligned or delayed solid stroke by sampling its normalized dash length across the full document. The dashed guide and progress stroke already share the exact same path; the mismatch was temporal rather than geometric.
- The original asymmetric `start 78%` / `end 28%` intersections caused the reveal front to drift from roughly 77% to 27% of a desktop viewport as the user moved down the page. Later chapters consequently showed large dotted-only areas even while they were actively being read.
- Changed the raw Framer Motion mapping to symmetric `start 90%` / `end 90%` intersections. The reveal front now stays near the bottom rail across the journey and reaches 100% at the document end, without a spring, wheel listener, scroll cancellation, or new render work.
- Desktop progress now measures 0.503 at the page midpoint and 1.0 at the bottom; 390×844 mobile measures 0.531 and 1.0. Visual checks around chapter 04 show the solid route covering the visible guide, with zero horizontal overflow or broken images.
- Final production build succeeds at 110.96 kB JavaScript and 6.86 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains the only build notice.

## 2026-08-23 · Geometry-safe route clipping

- Superseded the offset-only correction after the user still observed dotted-only sections. The dashed guide and solid path remained identical, so the remaining failure was isolated to the normalized SVG `pathLength`/dash-array reveal.
- Replaced the animated path dash with one complete ordinary solid path inside a user-space SVG clip. A single Framer Motion rectangle expands vertically from 0–1010 using the existing raw scroll progress, revealing every route fragment above the reading edge regardless of curve length or responsive SVG distortion.
- Retained the symmetric 90% viewport offsets, native document scrolling, reduced-motion completion, responsive stamp waypoints, and under-stamp masking. No spring, wheel handler, scroll cancellation, dependency, or layout read was added to scrolling.
- Browser inspection confirms guide and progress `d` strings match exactly, the solid path computes to `stroke-dasharray: none`, and the clip edge remains near 760 px throughout a 390×844 viewport. Desktop and mobile chapter-04 screenshots visibly show continuous solid ink entering the numbered stamp.
- Final production build succeeds at 111.42 kB JavaScript and 6.86 kB CSS gzipped. The empty test suite, overflow checks, true broken-image checks, and diff whitespace validation pass; stale Browserslist data remains non-blocking.

## 2026-08-23 · Scrapbook/Y2K interaction labels

- Removed the global organic ink-splash treatment: four offset droplet shadows, irregular blob radius, `--splash-*` variables, and the coupled hover/focus inversion are gone from source and rendered stylesheets.
- Replaced it with one monochrome pasted-label language. Hover-capable devices receive square color inversion, a small up-left lift, and two hard offset layers that resemble a misregistered cut-paper label; the treatment reuses the current ink, paper, and chrome theme tokens.
- Added a compact 50 ms pressed state with a single short hard shadow. Hover decoration is wrapped in `(hover: hover)`, preventing sticky label states after taps while keeping touch feedback tactile.
- Kept keyboard focus independent from the decorative hover state with a high-contrast solid outline. Primary and selected controls only invert their label variables for hover/active, so their focus outline remains dark against the paper.
- Browser QA clicked portfolio navigation and work filters, confirmed square label geometry and registration shadows, then moved activation to another filter and measured `box-shadow: none` / `transform: none` on the released control. Desktop and 390×844 checks found no overflow, broken images, unnamed buttons, splash variables, or organic-radius rules.
- Final production build succeeds at 111.42 kB JavaScript and 6.89 kB CSS gzipped. The stale Browserslist notice remains non-blocking.

## 2026-08-23 · Clean paper terminus

- Traced the apparent white box beneath the final contact scrap to two intentional spacing rules painted by the continuous paper wrapper: 3rem of `.paper-journey__content` bottom padding plus a 3rem desktop/2rem mobile bottom margin on `.contact-shell`.
- Removed both bottom spacers so the fifth scrapbook panel now defines the end of the continuous sheet instead of floating above a blank rectangular carrier.
- Moved only the fifth panel's lower tape from outside the panel to `bottom: 0.35rem`, preserving the taped-paper detail without requiring empty space or allowing the wrapper to clip it.
- Browser measurements at 1440×1000 and 390×844 show a 1 px difference between contact and wrapper bottoms, exactly matching the outer border. The tape remains inside the contact panel, with zero horizontal overflow or genuinely broken images.
- Final production build succeeds at 111.42 kB JavaScript and 6.89 kB CSS gzipped. The empty test suite and diff whitespace validation pass; stale Browserslist data remains non-blocking.

## 2026-08-23 · Clean-terminus rollback

- Reverted only the immediately preceding bottom-edge cleanup at the user's request.
- Restored 3rem of bottom padding on the continuous paper content, the contact panel's 3rem desktop/2rem mobile bottom margins, and the shared `bottom: -0.78rem` position for the fifth panel's end tape.
- Left the route, stamp masking, scrapbook/Y2K interaction states, content, and all earlier redesign work untouched.
- The optimized production build succeeds at 111.42 kB JavaScript and 6.89 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Flush terminus and readable ink lead

- Removed the restored 3rem paper-content padding and 3rem desktop/2rem mobile contact bottom margins, returning the final contact scrap to the actual paper edge.
- Reapplied the fifth-panel-only `bottom: 0.35rem` tape position so the decoration remains visible inside the clipped sheet.
- Changed the route observation window from `start 90% / end 90%` to `start 64% / end 90%`. This leaves a substantial dashed runway ahead of the solid ink during normal scrolling while still completing the route at the document end.
- Kept the existing user-space clip, identical guide/progress path geometry, raw scroll MotionValue, native scrolling, and reduced-motion completion behavior.
- Browser QA at 1280×720 and 390×844 confirms a 1 px contact-to-paper edge, zero overflow, no broken loaded images, a contained end tape, and a completed route at 100% scroll. The visible dashed lead measures roughly 97–203 px across sampled positions.
- The production build succeeds at 111.43 kB JavaScript and 6.89 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Exact document terminus

- Traced the remaining post-content scrolling to `.paper-journey` itself: a 7rem desktop and 5.5rem mobile outer bottom margin remained after the inner paper spacers were removed.
- Removed that responsive wrapper margin, so the document now terminates at the paper edge rather than providing a black runway beneath it.
- Updated the route window from `start 64% / end 90%` to `start 64% / end 100%`, preserving the slower visible reveal while completing the solid route at the same point as the content.
- Browser measurements at 1280×720 and 390×844 show zero document space after the paper and only ±0.45 px viewport alignment from subpixel layout rounding. The route reaches all 1010 SVG units, no functional footer link is obscured by the fixed rail, and there is no overflow or broken loaded image.
- The production build succeeds at 111.43 kB JavaScript and 6.89 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Quiet margins and integrated contact sheet

- Removed the complete decorative margin-note element, including `JH / field notes` and `Toronto → wherever the work goes`, plus its now-unused desktop/mobile CSS.
- Flattened only the fifth `PaperPanel` into the continuous paper by removing its opaque fill, black border, drop shadow, and both tape strips. Chapters 01–04 retain their pasted scrapbook treatment.
- Kept the 05 stamp as the route waypoint and retained the compact outlined contact-details block for information grouping and scanability.
- Desktop and 390×844 browser checks confirm zero margin-note nodes, a transparent/borderless/shadowless final panel, no visible chapter-05 tape, no trailing scroll space, no overflow, no broken loaded images, and no progress-rail overlap with functional links.
- The production build succeeds at 111.38 kB JavaScript and 6.85 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Mobile contact-route clearance

- Reproduced the chapter-05 route collision at 390×844 and 320×568. After crossing the 05 stamp on the right, the generated tail inherited the stamp's x-coordinate and continued vertically through the contact heading, details, and footer.
- Added a mobile-only final bend derived from the rendered paper and contact-content bounds. The route now leaves the stamp beneath its opaque face, moves into a 16 px torn-edge gutter, and completes outside the reading column.
- Kept the route through all five measured stamp centers, the solid/dashed geometry pairing, native scroll reveal, reduced-motion behavior, and desktop tail unchanged.
- Geometry checks report zero route samples inside the contact content blocks at 390 px and 320 px widths, zero horizontal overflow, and unchanged desktop behavior at 1280 px.
- The production build succeeds at 111.58 kB JavaScript and 6.85 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Mobile route-animation diagnosis

- Sampled the SVG reveal at eight native-scroll positions in a 390×844 viewport. With normal motion preferences, the clip height advances monotonically from 43.41 to 1010 SVG units, confirming the mobile animation remains active.
- Repeated the check with `prefers-reduced-motion: reduce`. The existing accessibility branch keeps the clip at the full 1010 units from the first frame through maximum scroll, intentionally presenting a static completed route.
- Confirmed the recent contact-overlap correction changes only the route's final geometry. It does not alter `useScroll`, `useTransform`, the reveal clip, or the motion-preference decision.
- The final mobile tail is now a long straight gutter segment, so its solid-over-dashed change can read like a static paper rule near the contact section even when the normal-motion clip is advancing.

## 2026-08-23 · Stable progress scrubbing and section stations

- Reproduced the range snap-back with a controlled desktop drag: the input recorded 23 backward reversals because each `behavior: auto` call inherited the root's smooth-scroll CSS while the scroll observer wrote intermediate document positions back into the range.
- Added transient scrub state in refs. Pointer dragging temporarily sets the root scroll behavior to `auto`, suppresses observer-driven range writes until release, uses 0.1% steps, and restores the prior behavior afterward; keyboard changes use the same immediate-scrolling path without leaving inline styles behind.
- Added five accessible section links above the rail as registration-pin stations. Their 24×24 px targets sit clear of the draggable thumb, show compact labels on hover/focus, mark the active location, and reuse the monochrome chrome tokens.
- Derived each station from its real section offset, section scroll margin, and root scroll padding. ResizeObserver recalculates them only when layout changes, preserving accurate positions after responsive or CMS-backed content changes.
- Browser QA reports zero backward input reversals on desktop and mobile, exact keyboard Home/End behavior, five named station links, zero overflow, and node landing positions within 0.04 percentage points of their rail coordinates.
- The production build succeeds at 112.35 kB JavaScript and 7.14 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist and unrelated existing runtime/network notices remain non-blocking.

## 2026-08-23 · Rail-aligned section stations

- Moved all five station dots from the offset pin row onto the range's exact centerline and removed the connecting stems, so the progress control now reads as one continuous transit rail.
- Preserved the 24×24 px accessible link targets and hover/focus labels. Only the station beneath or immediately beside the native thumb yields pointer input, allowing the thumb to remain draggable while every other station stays clickable and keyboard focusable.
- Browser geometry checks at 1280×720, 390×844, and 320×568 report a 0 px vertical difference between every station center and the rail center, with zero horizontal overflow.
- Drag QA records zero backward reversals across desktop and both phone widths; station navigation settles on the requested hash and active location.
- The production build succeeds at 112.38 kB JavaScript and 7.11 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Scrapbook/Y2K journey ticket

- Restyled the fixed progress control as a monochrome pasted field ticket: opaque cut-paper face, hard registration shadows, a single striped tape tab, subtle ruled-paper texture, and squared active/percentage labels.
- Made the actual route echo the page's SVG language. Completed progress is a solid ink line, upcoming progress is a dashed guide, and section stations use small rotated registration diamonds with an enlarged active state.
- Reworked the native thumb into a high-contrast diamond registration marker while preserving the existing native range, pointer scrubbing, keyboard support, reduced-motion behavior, and direct station links.
- Removed the translucent blur layer; the effect is CSS-only and adds no image, font, JavaScript, animation library, or runtime layout work.
- Light and dark screenshots retain high-contrast token inversion. Browser checks at 1280×720, 390×844, and 320×568 report five 24 px targets, exact rail alignment, zero drag reversals, correct section navigation, and zero horizontal overflow.
- The production build succeeds at 112.38 kB JavaScript and 7.45 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Flat ticket and Y2K sparkle stations

- Replaced the square/diamond station marks and range thumb with sharp four-point Y2K sparkle silhouettes using lightweight CSS `clip-path` polygons.
- Enlarged and rotated only the active, hovered, or focused station star, preserving the five 24 px link targets without adding continuous animation.
- Removed the complete three-layer offset shadow beneath the progress ticket so the control now sits flat; its border, tape, ruled texture, labels, and solid/dashed route remain unchanged.
- Desktop and 390×844 browser checks confirm the sparkle silhouette renders, the outer shadow computes to `none`, all stations remain centered, mobile overflow is zero, and dragging records zero reversals with exact input/document progress agreement.
- The production build succeeds at 112.38 kB JavaScript and 7.43 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Exact star registration and self-clearing labels

- Corrected the star overlap by insetting the station-positioning layer by half the 1.3rem native thumb size. The station stars now use the exact same usable travel span as the thumb instead of the input's full visual width.
- Removed the active station's 45-degree rotation so the station and thumb share the same four-point silhouette when superimposed.
- Replaced the percentage cell's full-width dashed border with a 0.9rem pseudo-line, reducing the underline to roughly one third of the cell width on mobile.
- Deleted the progress ticket's tape pseudo-element and its mobile override while retaining the subtle paper ruling.
- Added a 48 px scroll-distance dismissal for station tooltips. It changes only label visibility, preserves DOM focus and focus outlines, and resets when another station receives focus or the pointer re-enters after dismissal.
- Click checks put all five desktop stations within 0.13 px of the modeled native thumb center; the 390×844 and 320×568 checks are within 0.49 px and 0.09 px respectively. Label dismissal, zero mobile overflow, and zero drag reversals pass.
- The production build succeeds at 112.50 kB JavaScript and 7.43 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Mobile tap-visible station labels

- Reproduced the missing mobile label with a real touch-enabled 390×844 browser context. Mobile taps do not reliably leave the anchor in CSS `:focus`, and the previous 48 px rule also treated the anchor's own smooth navigation as later user scrolling.
- Added an explicitly pinned station-label state on link activation so the tapped label remains visible independently of hover or focus behavior.
- Added a ref-backed navigation phase with a 180 ms scroll-idle boundary. Smooth anchor movement continually updates the label's scroll origin; the 48 px dismissal baseline begins only after navigation settles.
- Kept transient navigation/timer values out of React state and retained the passive, animation-frame-coalesced scroll listener. Only pin/dismiss visibility changes cause renders.
- Touch QA confirms Toolkit remains visible after navigation, remains pinned after 24 px of later scrolling, and clears after 56 px. Tapping Profile afterward reopens its label, while rail dragging still records zero reversals.
- The production build succeeds at 112.60 kB JavaScript and 7.44 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Dot-grid scrapbook paper

- Replaced the continuous sheet's fine horizontal fiber lines with a true square dot matrix: 0.8 px ink dots repeated every 16 px over the existing warm paper and edge shading.
- Applied the same 16 px geometry at slightly lower contrast to all pasted chapter panels, so the separate scraps and exposed continuous sheet read as one notebook-paper system.
- Replaced the progress ticket's horizontal ruling with a tighter 12 px chrome-token dot grid at low opacity, retaining automatic light/dark inversion.
- Kept the outside black/white line grid distinct from the inner dot paper, preserving the scrapbook-on-worktable layering rather than flattening both surfaces into one pattern.
- Desktop and 390×844 visual checks confirm square computed background sizes, readable content and route contrast, zero overflow, and zero broken loaded images.
- The production build succeeds at 112.60 kB JavaScript and 7.47 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Sheet-only dot grid correction

- Scoped the new 16 px dot matrix to `.paper-journey` only, as clarified by the user.
- Restored the pasted chapter panels' original 4 px fine horizontal fiber ruling and restored the progress ticket's original horizontal ruling.
- Kept panel opacity, paper colors, edge shading, tape, borders, shadows, layout, and all interactions unchanged.
- Mobile computed-style and screenshot checks confirm the exposed sheet uses a radial dot grid while panels and the fixed rail use repeating horizontal gradients; overflow and broken-image counts remain zero.
- The production build succeeds at 112.60 kB JavaScript and 7.48 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Darker continuous-sheet dot grid

- Increased only the continuous sheet's dot opacity from `0.16` to `0.28`; dot size, 16 px spacing, paper color, and edge shading are unchanged.
- Left the pasted chapter panels, progress ticket, and exterior line grid untouched so each material keeps its existing visual role.
- Desktop and 390×844 visual checks confirm the darker grid remains quiet behind content, with zero horizontal overflow.
- The production build succeeds at 112.60 kB JavaScript and 7.48 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Modern-to-Y2K progression rollback

- Reverted only the immediately preceding progressive-era redesign across `SectionShell`, Header, About, Work, Skills, Footer, and their styles.
- Restored the earlier two-column hero, three-column project contact sheet with the first card spanning two columns, ordinary skill chips and experience typography, and the original contact composition.
- Removed the temporary era labels, ASCII bands, Y2K font tokens, indexed project labels, terminal/toolkit banner, hard-offset panel variants, and contact transmission treatment.
- Preserved all earlier continuous-sheet dots, paper panels, SVG route geometry and reveal timing, navigation, progress rail, filters, responsive images, themes, and accessibility behavior.
- Desktop and 390×844 browser checks confirm zero residual redesign elements, zero horizontal overflow, identical route paths, and an exact final scroll boundary.
- The production build returns to 112.60 kB JavaScript and 7.48 kB CSS gzipped. The empty test suite exits successfully; stale Browserslist data remains non-blocking.

## 2026-08-23 · Modern/Y2K reference analysis

- Analyzed eight supplied references as visual sources only; text inside the images was not treated as implementation instruction.
- Identified the modern references' core devices: oversized type used as architecture, media-first presentation, thin rules, asymmetric two-column information, restrained controls, and large areas of intentional whitespace.
- Identified the Y2K/zine references' core devices: condensed or outlined display type, controlled overlap, halftone/duotone imagery, vertical typography, ASCII/dot diagrams, photocopy texture, and dense micro-information.
- Mapped the ideas into a gradual portfolio arc: clean editorial Home and About, media-led Work, a technical-zine Toolkit transition, and a poster-like Contact payoff.
- Recommended content-specific scrapbook artifacts and technical diagrams instead of generic stars, era labels, terminal strips, or decoration repeated across every chapter.
- Kept the application source unchanged because this request was analysis rather than implementation.

## 2026-08-23 · Structural portfolio reference addendum

- Analyzed four additional screenshots under the user's explicit constraint to ignore their fonts, shapes, colors, and decorative motifs.
- Extracted a spacious identity-first hero, edge-anchored credibility details, wide horizontal project narratives, consistent media placement, deliberate overlap, concise achievement metadata, and a direct contact ending.
- Identified the repeated project frame as the strongest addition to the earlier direction: every case study can share one recognizable scrapbook dossier grammar while one project-specific artifact breaks the frame.
- Recommended retaining the current monochrome warm-paper system, dotted continuous sheet, route, stamps, and accessible rail rather than copying pink surfaces, television shells, scripts, tribal marks, or reference logos.
- Kept application source unchanged pending an implementation request.
