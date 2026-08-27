# Lessons

## Architecture and content

- Portfolio projects, skills, experience, and optional about cards are read from Sanity; personal, academic, social, resume, and contact details live in source files.
- The `About` component exists but is currently disabled in `App.js`, even though navigation still links to it.
- The existing `Header.jsx` already experiments with an interactive inspector card. That is a useful personal motif to refine, not discard.

## Performance and safety

- The current portrait is 3.6 MB at 3000x4000, so responsive AVIF/WebP derivatives will materially improve initial load.
- A `REACT_APP_*` Sanity token is bundled into browser code. Public portfolio reads do not need it; browser-side content writes should not rely on a secret.
- The current remote Google Fonts CSS request delays typography. A system-first local font stack will be faster and more private unless self-hosted font assets are added later.

## Interaction direction

- The journey should be expressed through progress, rhythm, and page-edge transitions while retaining native scrolling. Literal 3D page flips and scroll-jacking conflict with quick navigation, accessibility, and reduced-motion requirements.
- A native range input can serve as the draggable journey control while preserving keyboard and assistive-technology support.

## Book interaction revision

- The earlier decision to avoid literal page flips is superseded by the user’s explicit preference for a physical book. The safe compromise is a scroll-linked transform: native scrolling remains untouched, but the visible page responds to the resulting scroll progress.
- A single shared page primitive keeps the motion and edge-navigation behavior consistent across custom sections without introducing another animation dependency.
- Warm paper can remain constant in both themes. Automatic/manual themes still have an obvious effect by inverting the surrounding grid, fixed navigation, and progress chrome, which avoids turning the paper into a dark screen.
- CSS backgrounds, irregular border radii, and multiple small box shadows can suggest ink blooms and droplets with no downloaded media and no pointer-tracking JavaScript.
- Full-height page-edge links are appropriate on pointer devices, but on narrow touch layouts they should collapse to shallow bottom-corner controls so they do not cover reading content.
- Merging remote CMS records by replacing the entire local array can silently discard delivery-only metadata such as local image slugs. Merge remote editorial fields onto the known local project record so resilient media delivery survives CMS hydration.
- For this design, dark mode works best as a change to the surrounding desk and fixed chrome. Keeping the book surface invariant preserves the physical-paper metaphor and avoids unnecessary contrast recalculation inside every section.
- Browser verification showed the page-turn transform only activates near section boundaries, leaving long project and experience spreads flat while they are being read. That timing is the practical distinction between scroll-linked storytelling and scrolljacking.

## Stacking and motion refinement

- A convincing book needs separate physical layers. Rotating the container also rotates its cover and page-block shadow, which reads as a floating card; keep the cover/sheets static and animate only the top surface.
- Smoothstep interpolation removes the velocity discontinuity where a scroll-linked transform becomes flat, while a small spring filters trackpad noise without delaying navigation noticeably.
- Opacity should barely change during a paper turn. Strong fading competes with the material metaphor and makes long-form content feel unstable.
- `content-visibility` is valuable for very large DOMs, but an approximate intrinsic height can work against scroll-linked geometry. Five semantic sections and nine project cards are small enough to favor stable layout measurements.
- A black cover needs a subtle light keyline when the surrounding automatic theme is also black; otherwise correct physical stacking exists in the DOM but disappears perceptually.
- Chapter spacing is part of the book illusion. A transition gutter near 50 px leaves room for the 3D edge without making the next chapter feel like another independent object.

## Shared-cover correction

- Repeating a cover beneath every chapter still communicates multiple objects, even if sheet counts decrease. A single cover must be a sibling beneath the full page deck so its identity persists across chapter transitions.
- Bottom-sticky overlap is a useful compromise for variable-height editorial pages: tall content remains in normal document flow, but adjacent leaves can share the same physical stage briefly at the boundary.
- Motion realism comes from layered cues rather than a larger rotation angle: low-amplitude Z tilt, a moving surface shadow, an opaque page, and a stationary binding are more convincing than deep fading.
- Verify the computed style when an overlap appears ineffective. A later section-level `margin` shorthand can silently reset an earlier `margin-top`; a deck-scoped selector both documents the relationship and wins the intended cascade without `!important`.

## Continuous-paper pivot

- The literal book direction is superseded. When a material simulation needs increasingly complex stacking, clipping, measuring, and 3D transforms but still fails to feel natural, the interaction model is fighting the medium. A continuous paper metaphor communicates sequence without recreating physics.
- Put the actual sections back in document flow and attach navigation IDs to them. This removes duplicated marker geometry, keeps headings and links immediately available to assistive technology, and makes native hash navigation the source of truth.
- One stretched SVG path is enough to carry a long scroll narrative. Mapping the whole paper wrapper's `useScroll` progress to `pathLength` scales with CMS content and remains cheaper and more stable than measuring every chapter transition.
- A faint dashed route underneath the animated stroke gives the user an immediate sense of direction before the route is drawn. The black stroke then records progress without hiding future content or forcing a scroll pace.
- Scrapbook character comes from a small repeated vocabulary—tape, warm fibers, contact-sheet framing, rubber-stamp folios, margin notes, and clipped cards. Keeping those marks decorative and CSS/SVG-only protects semantics and initial load.
- Badges that sit outside a clipping work on wide layouts but can be cut by the continuous sheet's intentional overflow clipping. Move them inside the card edge on phone layouts rather than allowing horizontal overflow.
- The performance signal improved when the physics were removed: the final paper journey is 110.87 kB JavaScript and 6.84 kB CSS gzipped, with no new dependency and a smaller bundle than the shared-book version.

## Brush-stroke direction

- SVG does not support a continuously varying `stroke-width` along one path. Split the route into tangent-matched segments with decreasing widths, then overlap their round caps so the taper reads as an organic loaded-to-dry brush rather than disconnected lines.
- Reveal a textured static stroke through one animated mask instead of animating every visible layer. This keeps scroll-linked work to one `pathLength` MotionValue while allowing separate core, edge, and bristle treatments.
- A pale dashed scratch down the middle of a dark stroke reads as a road centerline. Dry-brush texture works better as sparse same-ink fragments just outside an irregular translucent edge, especially when the path is viewed at small scale.
- Test the endpoints, not only a midpoint: the directional cue depends on the contrast between the 13.5 px loaded start and 1.8 px finish, and both must survive the responsive SVG scaling.

## Independent transition marks

- If paint is meant to connect chapters, render each mark at the actual DOM boundary instead of mapping one SVG across the full document. Independent dividers remain aligned when CMS content, filters, images, or responsive wrapping change section heights.
- Raising decorative ink above clipping surfaces is safe when it lives in intentionally empty transition gutters, has no pointer events, and stays out of the accessibility tree. Raising a page-spanning route would risk drawing over readable content.
- A spring improves noisy physical simulations but creates perceptible trailing in an illustration expected to track the scroll position. Raw Framer Motion scroll progress is already updated on animation frames and is the better fit for an immediate ink reveal.
- Animated SVG `pathLength` is useful for visible strokes, but it can produce normalized dash artifacts when used as a mask in some rendering combinations. A rectangular mask is reliable for horizontally monotonic strokes; add a small ellipse at its leading edge to avoid a visibly square reveal front.
- Alternating left-to-right and right-to-left strokes creates rhythm without implying that all content belongs to one unbroken route. Keep the loaded end broad and the destination end fine so direction remains readable in either orientation.

## Continuous taper geometry

- Several centerline paths with decreasing `stroke-width` can only approximate a taper; their shared endpoints still expose round-cap bulbs or width steps. For a genuinely continuous brush taper, draw one closed filled shape whose two Bézier boundaries converge at the same final point.
- A transition path should use the vertical gutter as a spatial axis. A wide, shallow SVG inevitably reads as a divider rule even when its centerline curves; a compact square viewBox with preserved aspect ratio keeps diagonal and S-curved movement legible.
- Reveal a vertical connector along its dominant y-axis. A height-based mask follows scroll intuitively, and a small leading ellipse positioned from the curve's sampled x-values keeps the reveal front from looking like a hard horizontal crop.
- Visual QA is essential for SVG geometry: valid paths can still communicate the wrong object. The horizontal multi-segment implementation compiled and animated correctly but only screenshots exposed that it looked like a rule with stepped weights.

## Continuous variable-width routes

- A single SVG `path` element can still represent a line with continuously changing width when it is drawn as a closed filled ribbon. Treat the two sides as independent Bézier boundaries and vary their separation at several points through every chapter.
- Reveal a filled ribbon with a wider centerline path in a mask. Progressively drawing that mask follows turns and diagonals with a rounded leading edge; uncovering it with a growing rectangle exposes an unnatural horizontal cut whenever the route is not vertical.
- A full-document route needs responsive geometry, not just responsive scaling. Desktop chapter gutters can accommodate broad side-to-side crossings, while the same normalized y-span can cover headings after mobile content wraps. A separate margin-hugging mobile ribbon preserves one continuous line without sacrificing readability.
- High-layer decorative ink remains safe when the path is deliberately routed through margins and gutters, ignores pointer input, and is hidden from assistive technology. Visual QA should cover every crossing and the final tail, not only the first screen.
- Bind the mask's normalized `pathLength` directly to raw `useScroll` progress when immediate response matters. A spring adds a perceptible settling tail and is unnecessary for a passive paper trail that must stay synchronized with native scrolling.

## Continuous-feed perforations

- When a decorative route returns to a quiet editorial role, reduce its hierarchy as a system: uniform weight, faint future guide, and a layer beneath content. Changing only the width leaves the previous paint treatment's visual competition intact.
- Punched paper edges can be built with one repeating radial gradient per pseudo-element. Filling each center with the live backdrop token makes the dots read as holes in both themes without transparency masks, bitmap textures, or extra DOM.
- Pairing the holes with a restrained dashed tear line distinguishes continuous-feed perforations from an arbitrary polka-dot border. Keep both rails outside the reading column and scale their repeat interval down on phones.
- Restoring an earlier visual treatment does not require restoring an interaction flaw that was corrected later. The initial guide/progress appearance and the later raw scroll MotionValue can coexist, giving the requested look without reintroducing spring lag.

## Natural route geometry

- A path can be technically curved yet still feel constructed from elbows when each crossover is compressed into a short y-range. Give side-to-side movement more vertical runway so the eye reads an arc rather than a diagonal connector.
- Preserve tangent direction across cubic Bézier anchors: the outgoing handle after an anchor should continue the direction established by the incoming handle. Exact mathematical symmetry is unnecessary, but reversing a handle abruptly creates a visible kink.
- For a route intentionally placed behind opaque clippings, judge the exposed gutter fragments as carefully as the full SVG. Those fragments are the shape users actually see, and each should enter and leave a panel edge with a deliberate curve.
- Material details are strongest when they support the requested metaphor. Perforations communicated continuous-feed stock, but once rejected, restoring the irregular torn mask returned the scrapbook paper to the quieter role the route needs.

## Routes through responsive waypoints

- CSS pseudo-elements work well for static ornament but cannot be queried as layout waypoints. When an SVG must pass through a decoration, render an `aria-hidden` element with the same visual styling so its center can be measured without changing semantics.
- A simple waypoint curve does not need spline machinery. Connect consecutive points with cubic Béziers whose first control point shares the starting x and whose second shares the ending x; the route passes through every point with a continuous vertical tangent.
- Normalize measured DOM centers into the SVG viewBox instead of building the path in CSS pixels. The same generator then survives changes in viewport width, CMS-backed section height, and the full paper's aspect ratio.
- Layout-dependent geometry should update when layout changes, not on scroll. A `ResizeObserver` on the paper and panels plus a coalesced animation-frame measurement keeps the scroll path passive and avoids continuous forced layout.
- Responsive waypoints can preserve motion character by alternating inside safe edges. On mobile, place each stamp opposite its tape rather than collapsing all stamps to one side or letting them protrude beyond the clipped paper.

## Masking a route beneath markers

- If a route should appear to pass under an opaque marker, keep one continuous path at the lower layer and let the marker's fill occlude it. Redrawing the path inside the marker changes the visual relationship from “under” to “through.”
- Avoid adding a second background patch behind the marker label when the marker itself is already opaque. One complete masking surface prevents seams, reduces CSS, and keeps the label naturally centered.
- Distinguish lazy images that have not loaded yet from broken images during QA: `!img.complete` is expected for offscreen `loading="lazy"` assets, while `img.complete && img.naturalWidth === 0` identifies a true failure.

## Keeping scroll-drawn routes in view

- When both strokes use the same SVG `d`, an apparent guide/progress mismatch can be a timing problem rather than a geometry problem. Measure the normalized dash reveal before modifying the path itself.
- Asymmetric target offsets make a reveal front drift through the viewport. If a drawn route should stay just ahead of the reader, use the same viewport intersection for both the target start and end so the front occupies a stable visual depth.
- A 90% viewport line works well with a fixed bottom progress rail: the solid stroke fills nearly the complete reading area while its active endpoint remains just above the chrome.
- Test the beginning, middle, and reachable document end. An end offset above the viewport bottom may never reach 100% when the page has too little content after the observed target.

## Reveal by position, not path length

- A corrected scroll offset cannot solve every dotted-only failure when the visible stroke is still encoded as a normalized dash. Responsive non-uniform SVG scaling and curved path length make that representation harder to reason about than the reader's vertical position.
- For a page-height route whose narrative axis is vertical, reveal the complete solid path with a user-space rectangular clip. The guide and progress geometry then remain literally identical, and every point above the clip boundary is guaranteed to be solid.
- Verify the mechanism directly in rendered output: the solid path should have no dash array, both path `d` strings should match, and the animated clip height should place its lower edge at a stable viewport coordinate.
- A clip adds one cheap SVG rectangle and one derived MotionValue but avoids per-scroll React state, layout reads, or path recalculation. Route measurement should remain isolated to layout changes.

## Scrapbook interaction states

- Organic radii and scattered dot shadows communicate liquid ink even if the underlying interaction is just a color inversion. Removing an ink-splash motif requires deleting the silhouette and shadow vocabulary, not merely shortening its animation.
- A scrapbook/Y2K interaction can stay monochrome: use square cut-paper faces, hard registration offsets, and slight misalignment rather than adding neon or decorative media that would conflict with the established palette.
- Keep focus styling semantically separate from hover styling. Decorative inversion can respond to pointer hover, while a stable high-contrast outline gives keyboard users a predictable target without inheriting theme-specific face colors.
- Wrap hover-only decoration in `(hover: hover)` and provide a brief independent `:active` state. This avoids sticky hover visuals after touch taps while preserving immediate press confirmation.
- Validate the released state after clicking a second control. A successful cleanup should return the first element's shadow and transform to `none`, proving the effect is state-driven rather than visually persistent.

## Ending nested paper surfaces cleanly

- Bottom spacing on both a final child and its painted parent accumulates visually. A 3rem child margin plus 3rem wrapper padding reads as a separate blank sheet even when the DOM contains no extra component.
- When the last scrapbook panel should become the sheet terminus, remove spacing from both layers and verify their measured bottoms differ only by the outer border.
- Absolutely positioned tape outside a final panel often explains why blank runway was added. Move that one decoration inside instead of preserving a large empty carrier or clipping the detail.
- Inspect desktop and mobile separately because breakpoint-specific margins can make the same redundant backing strip a different height while preserving the same underlying cause.

## Reversing the paper terminus change

- Keep a visual rollback scoped to the exact inverse of the most recent patch. Restoring the two spacing rules and removing the one panel-specific tape override recovered the previous composition without disturbing the route or interaction work.
- Record reversals as superseding decisions instead of erasing earlier notes; the history remains useful context for why the same spacing may intentionally reappear.

## Keeping a scroll reveal visibly in progress

- A symmetric viewport offset keeps a reveal edge stationary. Moving only the start intersection upward makes the ink edge travel through a controlled viewport band, so the user can watch solid ink replace the dashed guide instead of finding most of the visible route already complete.
- Preserve a late enough end intersection to account for fixed bottom chrome and limited post-content scroll distance. Here, `end 90%` still reaches the route tail even after terminal paper padding is removed.
- Prefer retiming the existing raw MotionValue over adding a spring when immediacy matters. The 64%→90% window creates a 97–203 px visible dashed lead while every scroll input updates the clip directly.
- Verify both presentation and invariants: sample the clip edge throughout the document, confirm full completion at the bottom, and keep the solid and dashed paths geometrically identical.

## Ending the document exactly with fixed chrome

- Removing inner padding does not remove scroll space created by an outer wrapper margin. Measure the document bottom, paper bottom, and viewport bottom independently before deciding which layer owns a trailing runway.
- When the content wrapper should define the document boundary, its bottom margin must also be zero at every breakpoint; desktop and mobile overrides can otherwise reintroduce different-sized gaps.
- Supersede the earlier `end 90%` route guidance when no post-content margin exists: `end 100%` makes full route completion coincide with the paper reaching the viewport bottom.
- A fixed bottom control can coexist with an exact content boundary if functional footer targets remain above its rectangle. Test geometric overlap rather than adding unconditional scroll padding as a precaution.

## Flattening the final scrapbook layer

- A continuous paper can lose its identity when the final chapter repeats the same opaque fill, border, shadow, and tape as an inset scrap. Clearing those four cues on only the terminus lets the outer sheet become the visible surface again.
- Remove decorative copy from the DOM when it no longer serves the composition; hiding it only at a breakpoint leaves unnecessary layout and maintenance rules behind.
- Preserve structure selectively. The 05 stamp still encodes sequence and anchors the route, while the smaller contact-details border groups related facts without recreating a full-page enclosing card.
- Verify the flattened state through computed styles as well as screenshots: transparent background, 0 px panel border, no shadow, and hidden tape distinguish an intentional continuous sheet from a merely low-contrast nested box.

## Routing an SVG tail around responsive content

- A final SVG point that reuses a waypoint's x-coordinate is safe only while that waypoint remains in a true margin. Flattening or restacking the last section can turn the same coordinate into a content collision on narrow screens.
- Derive the mobile tail from rendered geometry: compare the final marker with the paper center, then place the tail between the content edge and torn paper edge. This preserves clearance across widths without a breakpoint-specific percentage that only fits one phone.
- Add a short post-stamp bend instead of moving the stamp waypoint. The route still passes through the numbered marker exactly, while the opaque stamp masks the directional change and the visible tail emerges in the gutter.
- Test path geometry as well as screenshots. Sampling the rendered SVG against content rectangles caught collisions directly and verified zero intersections at both 390 px and 320 px widths.

## Distinguishing disabled motion from low-visibility motion

- Inspect the animated property directly before treating a mobile report as a broken scroll source. Here, the SVG clip advances correctly under `no-preference` but remains fully open by design under `prefers-reduced-motion: reduce`.
- A fully revealed path can look like an animation that never started. Reduced-motion fallbacks should be documented explicitly because phone-level accessibility settings may differ from desktop settings.
- Geometry can make working motion hard to perceive. A straight solid-over-dashed tail near a paper edge reads like a border more readily than a curved route, even when its reveal boundary is moving.

## Keeping a controlled scroll range stable

- `window.scrollTo({ behavior: 'auto' })` can still animate when the root has `scroll-behavior: smooth`; `auto` defers to the computed CSS behavior. Repeated range inputs then restart smooth scrolling and let intermediate scroll events overwrite the controlled thumb value.
- Treat active scrubbing as transient state in a ref. Temporarily force immediate root scrolling, let the input own its value while the pointer is down, and restore observer synchronization and the previous scroll behavior on release or cancellation.
- Avoid whole-percent quantization for a visual scrubber. A 0.1% step preserves native input semantics while producing smoother thumb motion across both compact phone rails and wider desktop rails.
- Clickable waypoints should not cover the thumb's drag plane. Place full-size hit targets just above the track and connect them visually with short stems, keeping continuous dragging and discrete navigation independently usable.
- A section marker on a document-progress rail must include both `scroll-margin-top` and root `scroll-padding-top`. Using only raw section offsets makes its visual position disagree with the browser's actual anchor landing point.

## Sharing a native range rail with clickable stations

- Supersede the earlier offset-pin recommendation when the visual brief requires true on-rail stations: align each station's center to the range centerline and remove connector stems.
- Visual overlap does not require competing pointer ownership. Let only the node within a small progress-space clearance of the thumb use `pointer-events: none`; the native input then receives the initial drag while distant stations remain direct links.
- Pointer passthrough does not remove an anchor from keyboard navigation or the accessibility tree, so the under-thumb station can remain semantically available even while its pointer hit area yields to the range.
- Validate this composition at the narrowest rail width. A percentage-based clearance protects the thumb on compact phones more reliably than a fixed pixel distance, and pointer capture keeps an active drag stable while crossing other station overlays.

## Giving fixed chrome the scrapbook/Y2K language

- Reuse the page's real visual grammar instead of adding unrelated nostalgia cues. Here, cut-paper layers, hard registration offsets, tape, monospaced labels, and the same solid-over-dashed journey line make the rail feel native to the scrapbook rather than generically “retro.”
- Spend decoration in one place. One asymmetrical tape tab and one hard layered shadow carry more identity than several animated stickers, while keeping the progress data immediately scannable.
- Native range pseudo-elements can carry the themed track and thumb without changing input semantics. Keep the larger transparent input box as the interaction plane even when the visible thumb becomes a compact custom mark.
- Build theme details from existing chrome tokens. The same ticket naturally inverts in dark mode without a second rule set, and an opaque surface avoids the rendering cost and visual softness of backdrop blur.
- Use the dashed rail as information, not texture alone: it distinguishes the route still ahead from the solid completed segment and mirrors the portfolio's scroll-drawn path.

## Drawing compact Y2K sparkle controls

- A symmetric eight-vertex `clip-path` can produce a crisp four-point sparkle without an SVG asset: long cardinal tips and tight diagonal shoulders create the recognizably Y2K silhouette even at sub-rem station sizes.
- Apply the same silhouette to the native range thumb and linked stations to make discrete navigation and continuous scrubbing feel like one control family.
- Keep the semantic hit area rectangular and larger than the visible star. The stations remain 24 px links and the native range retains its full-height pointer plane even though their painted silhouettes are compact.
- When the ticket already has tape, texture, and a strong border, removing its offset foundation improves hierarchy. The sparkle markers become the focal detail without weakening the control boundary.

## Registering waypoints with a native range thumb

- A custom range thumb does not travel center-to-center across the input's full width. Its center starts half a thumb inside the left edge and ends half a thumb inside the right edge, so percentage-positioned overlays drift most at the endpoints.
- Give the waypoint overlay equal left/right insets of half the shared thumb size. Its percentage coordinates then use the same travel span as the native thumb without scroll-time measurement or per-node pixel math.
- Matching center coordinates is not enough if overlapping silhouettes use different rotations. Keep the thumb and active waypoint in the same orientation so their combined shape reads as one registered mark.
- Dismiss a scroll-obscured tooltip visually instead of blurring its anchor. A ref-backed origin and one state change after a meaningful scroll distance can hide the label while preserving keyboard focus and its outline.
- Guard pointer-entry resets while a label is already open. Otherwise pointer-event changes around an overlapping thumb can repeatedly move the dismissal origin during scroll.
- A short pseudo-element rule is preferable to a cell-wide border when an underline should be shorter than its percentage label; the data column can keep its layout width independently.

## Keeping tap labels visible through anchor navigation

- Mobile taps cannot depend on `:focus` or sticky `:hover` to present persistent feedback. Pin the activated label explicitly, while keeping focus semantics and hover affordances as independent input-mode enhancements.
- Do not count a station link's own smooth anchor travel as the “later scroll” that dismisses its label. Track the navigation phase transiently, move the dismissal origin with its scroll frames, and establish the final baseline only after scroll activity becomes idle.
- A short scroll-idle timer is a compatible fallback when `scrollend` support cannot be assumed. Clear and reschedule it inside the existing animation-frame-coalesced scroll path, then clean it up on unmount.
- Keep navigation flags, timer IDs, and scroll origins in refs. React state is only necessary for the two user-visible transitions: pinning a label and dismissing it.
- Verify mobile behavior with a touch-enabled browser context. Desktop click emulation can preserve focus in ways that hide the exact failure seen after a phone tap.

## Building a quiet CSS dot-grid paper texture

- Use one radial gradient with equal x/y background sizing to create an actual square dot matrix. A 0.8 px dot on a 16 px repeat remains visible without turning body copy into visual noise.
- Preserve material depth by keeping the paper's edge-shading gradient above the dot layer and the warm solid color below it. Replacing only the former ruling layer avoids disturbing borders, route geometry, or layout.
- Give related surfaces the same grid spacing but tune contrast by role. The exposed sheet can carry a slightly stronger dot, pasted panels a quieter one, and compact fixed chrome a denser low-opacity variant.
- Keep the worktable grid and notebook dot grid distinct. Different primitives and scales make the pasted-paper relationship legible instead of producing moiré-like repetition across the entire viewport.
- Confirm computed `background-size` as well as screenshots. It proves the dots are arranged on a square matrix rather than merely appearing as a noisy radial texture.

## Scoping texture to the intended paper layer

- “Continuous sheet” and “chapter scraps” are separate material roles even when they share warm paper colors. Texture changes should target the named structural layer rather than propagate through every paper-like surface.
- Preserve contrast between nested materials: dot-grid backing paper and fine-fiber pasted panels make their hierarchy clearer than one repeated pattern across both.
- When correcting scope, restore the exact prior gradient layers on unaffected surfaces instead of approximating them. This keeps earlier visual decisions and computed rendering stable.

## Tuning dot-grid contrast without changing density

- Darken a sparse paper pattern by increasing the dot layer's alpha before changing its radius or repeat size. This improves contrast without making the texture feel denser or disrupting its established rhythm.
- Check both the exposed sheet and its nested panels after a texture adjustment. A narrowly scoped opacity edit should leave the panels' separate ruling and the surrounding worktable grid unchanged.

## Rolling back a cross-section visual pass safely

- Treat a visual redesign as a bounded layer even when it touches many files. Removing its unique classes, props, tokens, and decorative elements provides a reliable residue check without disturbing earlier shared behavior.
- Verify structural restoration with computed layout evidence as well as screenshots. Column counts, font families, text transforms, route-path equality, overflow, and the document endpoint make a rollback auditable beyond visual similarity.

## Translating Y2K references without superficial decoration

- Era is communicated more convincingly through composition than labels. Type scale, crop, collision, density, image processing, and alignment can create a Y2K shift without writing `Y2K MODE` or scattering unrelated symbols.
- Preserve a rational information layer beneath expressive art direction. The references pair dramatic type or collage with thin rules, readable metadata, and clear grid logic; that tension keeps experimental work navigable.
- Let density increase gradually. Early sections can use aligned editorial clippings and whitespace, while later sections introduce vertical type, halftone imagery, ASCII topology, and overlap. Applying maximum collage density everywhere removes the sense of journey.
- Make scrapbook ephemera content-derived: a project can become a contact sheet, receipt, track list, evaluation strip, or diagram based on its subject. Content-specific artifacts feel personal where generic stickers feel ornamental.
- Reserve distressed, condensed, outlined, or monospaced type for display and metadata roles. Body copy should keep a legible sans-serif face, stable line lengths, and accessible sizing.
- CSS, SVG, and one optimized responsive raster asset are enough for most of this visual language. Heavy video backgrounds, WebGL, and continuous effect animation would weaken the portfolio's speed and reduced-motion goals.

## Separating a presentation system from its surface style

- A reference can be useful even when none of its fonts, colors, frames, or symbols belong in the target design. Extract the recurring order of information, spatial rhythm, media relationship, and exception rules first.
- Repeated project composition builds recognition and scanning speed. Keep the problem statement, project identity, outcome, and visual proof in stable roles, then allow one subject-specific fragment to cross the boundary.
- Overlap works best when it communicates ownership: a project image or artifact physically breaking out of its dossier reads as evidence attached to that project, while unrelated overlap reads as decoration.
- Small credibility details are strongest at composition edges, where they establish context without competing with the hero thesis.
- A portfolio ending should be intentional. Moving directly from the last project outcome into a compact contact action produces a clearer terminus than adding another decorative chapter or empty runway.

## Prioritizing identity in a portfolio hero

- A portfolio’s only `h1` should answer who the person is before expressing a design philosophy. The name carries the display hierarchy; a smaller occupation line supplies immediate professional context without competing with it.
- When both lines belong to one heading, separate spans preserve one semantic title while allowing display and utility typography to establish a clear visual hierarchy.

## Making display type genuinely architectural

- A block that is `width: 100%` does not make its glyphs visually span that width. Measure or inspect the rendered word itself, then tune the font scale for its actual character widths.
- Long and short names need different responsive scales. Separate first- and last-name classes allow both words to approach the same visual measure without artificial character spacing or stretched transforms.
- A bold system sans paired with a high-contrast system serif can create a strong modern/editorial shift without adding font requests, layout delay, or another runtime dependency.
- Preserve a dedicated mobile scale rather than letting an intentionally oversized desktop masthead interpolate downward unchecked; this keeps the typographic gesture without causing horizontal overflow.

## Rendering Unicode ASCII art responsively

- Character count alone does not determine a text portrait’s width. Mathematical symbols can fall back to a font whose cells are wider than ordinary monospace glyphs, so compare the rendered `scrollWidth` and `clientWidth` before trusting the nominal grid.
- A fixed 100×73 source can remain responsive by placing it in a square container-query context and deriving font size from `cqw`; adjust line-height independently so width and height both fill the frame.
- Keep dense ASCII source in a separate emitted text asset and fetch it from the same origin. This preserves the original characters without inflating the initial JavaScript bundle.
- Reserve the layout space before the asynchronous text arrives. A fixed aspect ratio prevents layout shift, while a figure label supplies an accessible equivalent and the dense character field remains hidden from screen readers.
- If an ASCII portrait replaces a raster portrait, remove the raster imports rather than merely hiding the image. The build can then exclude all responsive photo variants entirely.

## Framing artwork and its metadata

- Put an artwork border on the element that establishes the artwork’s dimensions, not on the parent figure when that figure also contains a caption. Otherwise the visible frame describes two different content roles at once.
- Keep captions semantically inside `<figure>` but visually outside the artwork border. This preserves the relationship for assistive technology while making the physical edge unambiguous.
- Apply scrapbook registration shadows to the framed viewport itself. The shadow then tracks the actual artifact instead of appearing detached beneath a larger caption-bearing wrapper.

## Correcting a loose artwork frame without changing its scope

- Supersede the artwork-only framing guidance above for this portrait: the intended frame describes the complete scrapbook figure, including its caption.
- When one edge appears to contain excess empty space, inspect parent padding before relocating the border. Moving the frame changes what the component communicates; removing the unwanted inset fixes the geometry without changing that relationship.
- Put spacing on the child that needs it. Here the artwork is flush with the figure frame while the caption alone owns its internal padding.

## Fitting Unicode character art by rendered geometry

- Supersede the flush-frame conclusion above: a small uniform mat is useful because it keeps the outer scrapbook frame legible against a dense character field. The problem was the large asymmetric void inside the artwork window, not the presence of a deliberate frame inset.
- A nominal `100 × 73` character grid does not determine its visual aspect ratio. Unicode integral and square-root symbols can fall back to glyphs whose advance width is much smaller than their line box, even inside a monospace stack.
- Measure the rendered text range, not the `<pre>` element's client or scroll width; an absolutely positioned block reports its container width even when its glyphs occupy far less space.
- Correct font size and line height as a pair. Increasing only the font size fills the width but clips lower rows; tightening the line height at the same time lets the full portrait fill a square viewport without horizontal stretching.

## Extending an ASCII canvas without changing the portrait

- If the portrait proportions are already correct, do not use typographic compression to solve unused canvas width. That changes the perceived face even when every source character remains present.
- Preserve the original rows and extend only the background side of the character field. Reusing each row's own edge texture keeps its local density and symbol language consistent without redrawing the subject.
- Treat the character dimensions as real metadata. When the source grows from 100 to 119 columns, update the visible caption and verify every row has the same new width.
- When the filler glyph is explicitly specified, use a uniform suffix rather than extrapolating nearby texture; this makes the modification predictable and keeps the original portrait columns untouched.
- When multiple filler glyphs describe top and middle regions, divide by source rows rather than visual pixels so the bands remain deterministic at every responsive size.

## Simplifying a content-rich portfolio hero

- Keeping information does not require keeping cards. Short facts read more calmly as ruled `dt`/`dd` rows, preserving scanability and semantics while reducing visual weight.
- When persistent navigation already supplies section access, duplicate hero buttons create noise without improving wayfinding. Removing them lets the identity and role become the clear first read.
- Tabbed biography content adds interaction cost and hides useful context. Moving the same copy into an always-visible About composition improves reading order, accessibility, and JavaScript simplicity.
- A minimal hero benefits from one coordinated entrance rather than separate animations on every line and artifact; motion should introduce the composition, not compete with it.
- An expressive asset can remain inside a modern layout when its container is quiet. A thin, square frame and deliberate alignment let the ASCII portrait provide personality without making the entire hero feel ornamental.

## Turning profile metadata into two direct columns

- When every line has equal rhetorical weight, label/value pairs add hierarchy the content does not need. Two semantic lists can communicate role, scope, education, and location more directly.
- Keep the visual instruction and the semantic structure aligned: two visible columns should be two real lists, not one list positioned into columns with layout-only ordering.
- Lowercase medium-weight sans serif text feels calm only when line lengths remain short. Let narrow layouts wrap within each column instead of shrinking the type excessively or changing the requested column count.
- A small static rotation is enough to return scrapbook character to one artifact. Reducing the angle on mobile protects the torn-paper margin without requiring breakpoint-specific markup or motion.

## Using alignment instead of separators

- Opposing text alignment can establish two distinct information zones without a vertical rule: anchor one list to the left edge and the other to the right edge, then let the empty center act as the separator.
- When list semantics are useful but bullets are visually unnecessary, keep the `<ul>` structure and remove both `list-style` markers and generated pseudo-content. Accessibility does not require ornamental markers.
- To reclaim empty hero space, adjust the masthead's internal inset rather than applying a negative transform. Padding changes preserve normal flow, route measurements, and the relationship between the masthead and the information below it.

## Overriding shared panel spacing locally

- When a shared scrapbook panel's padding creates unwanted whitespace in one chapter, override only that chapter's relevant edge instead of weakening the global panel rhythm.
- A compound selector such as `.paper-panel.hero-scrap` makes the local top inset deterministic across the shared mobile `.paper-panel` rule without resorting to `!important` or transforms.
- Measure clearance from the actual panel border after the override. Here a 32–48 px rendered name inset keeps the raised masthead safely separated from the tape, stamp, and border.

## Removing optional section labels semantically

- If a reusable section eyebrow is optional, omit its element entirely rather than rendering an empty paragraph or hiding text with CSS. This keeps the accessibility tree and DOM aligned with the visible design.
- Preserve intentional editorial whitespace with layout state, not placeholder content. An explicit no-eyebrow modifier can hold the main heading in column two on desktop and reset it to column one at the mobile breakpoint.
- Matching an existing type treatment means matching the full stack and weight, not only choosing another serif. The About heading now uses the same Times New Roman/Times fallback chain and weight 400 as the hero surname.

## Placing wide character art in an editorial heading

- Preserve supplied fixed-width art as one newline-joined source value rather than reconstructing it with positioned fragments; this keeps deliberate spacing and glyph relationships reviewable.
- Size character art by rendered geometry, not line count. The desktop map needed enough scale to read while retaining breathing room before the heading; a separate fluid mobile scale prevents the longest row from widening the document.
- When a decorative margin disappears at a responsive breakpoint, stack its artifact before the heading instead of shrinking it into illegibility. This preserves the content-first DOM order and lets the composition remain recognizable.
- A reusable heading-art slot is preferable to section-specific absolute positioning: the art stays in normal flow, cannot desynchronize route measurements, and can remain `aria-hidden` when equivalent meaning already exists in text.

## Preserving intentional whitespace in character art

- Leading whitespace is part of the drawing, not formatting noise. Store supplied character art as one raw template literal when indentation varies by row; a visually tidy array can accidentally normalize the silhouette.
- Verify the source shape independently from the render by recording each row's leading-space count. This catches broken geography before CSS or font fallback complicates the diagnosis.
- Readability sometimes requires changing the surrounding grid, not merely increasing `font-size`. Giving the artwork a real half-width column at large screens and stacking it earlier lets the glyphs grow without overlapping the heading or creating page overflow.

## Enlarging character art without enlarging its footprint

- Rearrangement can create more scale than compression. Separating two side-by-side drawings and stacking them reduced the widest row from roughly 69 character cells to 26, allowing an 80% larger font inside a narrower box.
- Preserve each drawing's internal indentation while normalizing only the space between drawings. This retains recognizable silhouettes without carrying over the empty geographic distance from the original combined map.
- When static visual JSX has no component inputs, hoist it to module scope. The result documents the artifact as fixed content and avoids recreating an identical element tree during renders.

## Staggering stacked artwork within a fixed measure

- A full-width internal grid does not enlarge the parent layout; it creates alignment space inside the existing column. Individual fixed-width drawings can then anchor to opposing edges without changing surrounding content geometry.
- Increase glyph scale only after measuring the larger drawing against the column's narrowest side-by-side breakpoint. Here Asia remains inside the first column with 43 px of separation from the heading at 1440 px.

## Making a label part of the artwork's structure

- If a label must read between two drawings, give it its own grid row rather than positioning it over an incidental gap. The composition then survives font and viewport changes without overlap.
- A small symmetric negative margin can create controlled visual bleed while the parent column and document width stay unchanged; verify `scrollWidth` at the narrowest viewport after applying it.
- Separate row gaps communicate deliberate vertical distance more reliably than a negative margin on the lower drawing.

## Layering a grid behind character art

- A hollow radial-gradient mark reads as a perforation rather than another paper dot, allowing two nearby grid systems to remain visually distinct.
- Put generated texture on a pseudo-element and raise the real artwork one layer above it; this avoids adding decorative DOM or assets and keeps the effect effectively free at runtime.
- Protect small text with a local opaque backing, and fade a dense texture at its outer boundary so it reads as part of the artwork rather than as a new rectangular panel.

## Distributing an unknown number of labels across a panel

- Flex growth is a better fit than a fixed column count when the number of short labels can change. Each ticket receives equal leftover width without introducing empty grid tracks.
- A wrapping `flex-basis` creates one balanced desktop row while allowing two-column mobile rows; an odd final item naturally grows across the remaining row.
- Keep `min-width: 0` and centered text on each flex item so longer labels shrink safely instead of widening the document.

## Replacing a shared type role safely

- When an unwanted font is supplied through one design token, change the token rather than scattering component overrides. All labels then move together and future utility text inherits the correction automatically.
- Audit representative computed styles after changing a type token because proportional widths can affect controls, captions, rails, and metadata even when no layout CSS changes.
- Preserve monospace only where it is structural. Character drawings need fixed cells; interface labels do not.

## Combining modern hierarchy with scrapbook and Y2K detail

- Let hierarchy carry the modern layer and let material treatment carry the scrapbook layer. Large, clean titles and measured copy remain easy to scan while paper texture, offset mounting, and registration shadows add personality around them.
- Technical decoration feels intentional when it visualizes the nearby discipline. A browser grid, measurement frame, and request topology communicate Frontend, UI/UX, and Backend more clearly than interchangeable stickers or random Y2K symbols.
- Treat long display words as breakpoint constraints. Check each heading's `scrollWidth` against its content width at desktop, tablet, and phone sizes; a character-based `max-width` can cause local text overflow even when the page reports no horizontal overflow.
- Static inline SVG is a good fit for this kind of ornament: it inherits theme color, compresses with the JavaScript bundle, requires no network request, and can be removed from the accessibility tree when the adjacent text carries all meaning.
- Alternating offsets need an exit condition. Removing rotation and asymmetric widths on compact screens preserves the scrapbook idea on wide layouts without sacrificing the phone reading column.
- For a title column containing long unbreakable words, `minmax(min-content, …)` is safer than a fixed minimum: it lets the browser reserve the actual glyph width before distributing remaining space to the description.
- Test beyond a section's maximum-width threshold. A viewport can keep widening—and fluid type can keep growing—even after its container stops, exposing collisions that do not exist at the nominal desktop breakpoint.

## Preserving section rhythm while simplifying copy

- Removing several heading elements should not automatically collapse the section. Measure the old header at representative breakpoints and transfer that rhythm to an explicit responsive minimum height.
- A single word can genuinely span a container without stretching glyphs by exposing its letters as decorative flex children and keeping one accessible label on their wrapper.
- Hoist a fixed decorative heading tree to module scope so the visual treatment adds no repeated render work or component state.
- Once individually wrapped letters should read as one word again, center the group and control spacing with an explicit responsive `gap`; `space-between` couples letter spacing to container width and makes a wordmark feel mechanically stretched.
- Display scale and section rhythm can be tuned independently. Increasing the glyph size while retaining the measured heading `min-height` creates taller type without pushing the filters or project grid farther down the page.
- Lowercase glyphs can be materially narrower than their uppercase counterparts even in the same serif face. When the brief forbids looser tracking, derive the display size from the actual heading container and let the letterforms grow instead.
- Container-query units are more reliable than viewport units for an edge-registered masthead inside a capped paper sheet: the type stops growing when its real content measure stops, even if the exterior viewport continues widening.
- A long editorial statement can gain mobile presence through both scale and measure. A modest font increase combined with a narrower character width creates intentional vertical rhythm without artificial line breaks in the content.
- Short filter sets should wrap into visible touch targets instead of becoming horizontal scrollers. A two-column grid with the universal `All` action spanning both columns keeps every option discoverable and preserves a clear hierarchy at 320 px.
- A single `grid-column: span 2` does not by itself create a convincing featured story when the adjacent compact card still controls the shared row height. Give the feature its own row, then begin the repeating archive below it.
- Repetition should support scanning, not flatten importance. A portfolio grid benefits from one clearly editorialized proof piece and a quieter, consistent archive; adding more stickers to identical cards does not create hierarchy.
- Never join CMS records to local presentation data by mutable display copy. A punctuation-only title edit can silently disable local assets and layout fields; use a stable shared ID or slug, then allow the title to change independently.
- Do not advertise an image format in `<picture>` until the backing transformation service supports it. Sanity currently rejects `fm=avif`; an AVIF-capable browser will still select that first source and surface the HTTP 400 as a broken image instead of falling through to WebP.
- When removing a grouping heading, promote its remaining child headings if needed so the visual simplification does not leave an avoidable semantic level gap.
- Empty editorial space is best filled with content-specific structure rather than generic ornament. Repeating the real experience years as an aria-hidden visual register balances the masthead while leaving the ordered timeline as the accessible source of truth.
- A motion-rich portfolio still needs a hierarchy: one memorable load sequence and one primary scroll-drawing moment feel more intentional than applying the same fade-up to every card, heading, and decoration.

## Building a restrained motion system for a scrapbook portfolio

- A useful filler should explain how the person works. Turning existing role language into a semantic loop adds meaning and visual balance without inventing another biography, metric, or decorative theme.
- Put motion timing and viewport policy in one small module. Shared easing, reveal thresholds, and stagger rules keep different chapters related while still allowing the hero and timeline to have distinct choreography.
- Reduced motion needs a content-visibility strategy, not just shorter durations. Returning `initial={false}` prevents viewport-hidden content from flashing or remaining unavailable when motion is disabled.
- Animate a wrapper when the child already owns a scrapbook rotation or transform. This keeps Framer Motion from replacing the static CSS transform that gives the portrait, capability sheet, or Build Loop its physical character.
- Replace timeline pseudo-elements with real aria-hidden elements when their line growth and node registration need independent animation; the semantic ordered list and written dates remain the accessible source of truth.
- Viewport-triggered reveals should use `once: true` and a modest visibility threshold. Replaying every time a user reverses direction makes ordinary scanning feel unstable and turns native scrolling into an animation controller.
- Validate motion in sampled time slices, then verify the final static composition separately. The page still has to be complete, overflow-free, and readable after the choreography ends.

## Avoiding scroll-time clipping on very long decorative sheets

- A complex percentage-based clip path on an element taller than 8,000–11,000 px is a poor fit for a scrolling document. Even when geometry is correct, the browser may composite or repaint it in tiles and briefly expose the layer beneath.
- Repeat a small edge primitive instead. A theme-colored pseudo-element with a short repeat-y mask preserves the torn silhouette while keeping the reusable paint unit independent of total document height.
- Do not fade an entire paper card from opacity zero when its background is part of the page structure. Keep the surface painted and animate a small registration shift—or animate only its contents—so fast scrolling never produces an unexplained hole in the composition.
- Intersection thresholds that feel reasonable for short text can be visibly late for tall cards. Trigger large scroll-revealed regions slightly before they enter the viewport, then retain `once: true` so reversing direction remains calm.

## Preventing directional viewport-edge flicker

- Diagnose the trigger before changing persistent page decoration. A flash that follows scroll direction and begins immediately after adding reveals is stronger evidence of viewport animation state than of a pre-existing paper edge.
- Do not attach opacity or transform reveals to large opaque layout surfaces. When those blocks cross the leading edge, a single delayed Intersection Observer update can expose their carrier and read as clipping or flicker.
- Keep the structural surface static and animate smaller internal details. This preserves the intended choreography without making the page's visual continuity depend on intersection timing.
- If a small detail should animate on entry, use a generous root margin and `once: true` so it is armed before either viewport edge reaches it and never replays when the user reverses direction.
- When a user still sees the directional flash, audit every rendered descendant rather than only the large carriers. Several small transformed children inside one chapter can retain enough compositor work to expose the shared background during a fast leading-edge scroll.
- For long, texture-heavy pages, a static final-state diagram is often a better trade than multiple Intersection Observer animations. Load-only motion can still provide personality without tying raster work to scrolling.
- A completed load animation can still leave compositing hints behind. Framer Motion's final inline `translateZ(0)`, transform, and clip-path values may keep hero glyphs on separate layers after the visible entrance is over; static markup removes those layers entirely.
- When a screenshot shows nested rectangular flashes, measure generated pseudo-elements as well as real DOM boxes. Here the otherwise invisible `::after` dimensions matched the complete inter-chapter gap and duplicated the panel texture over the continuous sheet.
- Let one layer own a transition zone. A dotted-sheet gap is visually intentional and cheaper to paint than stacking a ruled panel continuation over it merely to hide the contrast.

## Isolating scroll-linked SVG repaint cost

- A passive scroll listener is not automatically cheap: a MotionValue connected to an SVG presentation attribute can still cause a paint on every animation frame without a React component re-render.
- When the SVG spans an entire long document, animate or reveal it only after proving the layer can remain composited; a changing internal clip can invalidate much larger raster regions than the visible stroke suggests.
- Change one scroll-time compositor variable at a time. Keeping the rail, blur, textures, and torn edges fixed makes a real-browser result attributable to the route rather than to a bundle of speculative optimizations.
- A MutationObserver is a useful structural check for direct SVG attribute writes during synthetic rapid scrolling, but a real-browser visual test remains necessary for GPU checkerboarding and display-specific tearing.
- A fixed translucent `backdrop-filter` makes the browser continually resample whatever textured surfaces cross beneath it. On a long raster-heavy page, an opaque theme token removes that live dependency while preserving the same navigation hierarchy and light/dark contrast.
- Isolation results outrank plausible theory: removing the navbar blur produced no visible change in the target browser, so restore the intended design instead of keeping an ineffective simplification.
- Frame-frequency values that do not affect application composition belong in refs rather than React state. Updating a native range and a handful of local attributes avoids reconciling the entire rail component while keeping its accessible live feedback intact.
- Do not retain a ref-based optimization merely because it is theoretically cleaner when the target visual artifact is unchanged; restore the simpler implementation and move down the paint pipeline.
- Offscreen hiding is not a universal cure for scrollbar-jump checkerboarding. Observer-driven visibility can lag large native scroll jumps, and `content-visibility` may either show intrinsic placeholders or be defeated by geometry reads from a document-wide route.
- A stacking context spanning nearly 9,000 px with a large blurred shadow is a more direct raster target than offscreen semantic content. Flatten the large structural carrier first, retain a cheap hard offset for the scrapbook aesthetic, and keep panels rendered normally until evidence points at them.

## Diagnosing checkerboarding beyond the layer that flashes

- The layer visible in a checkerboard is not necessarily the layer causing raster starvation. Here the continuous paper flashed after image decode/paint work in the earlier Work chapter saturated the compositor.
- Use fresh browser processes for cold-tile comparisons. Sequential variants in one process inherit Chrome's tile, glyph, and decoded-image caches and can make the second architecture look much cheaper regardless of its design.
- Split main-thread Paint from renderer raster and GPU flush. Low Paint time alongside high raster/flush time is evidence against React rerenders and layout computation as the primary bottleneck.
- In a `<picture>`, responsive candidate selection is controlled by the chosen `<source>`. Put `sizes` on every AVIF/WebP source; an `img[sizes]` value does not correct a source that defaults to `100vw`.
- Verify the browser's actual `currentSrc` at DPR 1 and DPR 2. A correct `srcset` can still overdecode every card when its layout hint is missing or when compact and featured media share one exaggerated size.
- `content-visibility:auto` is safest on a fixed-geometry media viewport, not an entire route-measured section. An explicit aspect ratio preserves document height while allowing the expensive descendant image paint to be skipped offscreen.
- Decode-ahead can reduce scroll-time work, but it transfers cost to startup. Correct candidate dimensions and localized paint culling should come first for a portfolio whose initial load must remain fast.
- Compare native scrollbar dragging with a JavaScript-driven range before blaming scroll listeners. A native thumb may move the compositor ahead of raster work, while an `onChange` → `scrollTo` control is naturally gated by main-thread event delivery and can appear clean on the same document.
- Do not migrate routers or server-state libraries to solve a raster bottleneck. If the rendered DOM and CSS remain the same, the compositor receives essentially the same paint workload; optimize pixels, paint boundaries, and decode timing first.

## Restoring motion without restoring structural flicker

- Reintroduce animation at the smallest meaningful layer. Moving a diagram, timeline rule, label, or text group preserves the continuous paper beneath it; fading or translating the complete paper carrier creates a visible structural hole.
- Scroll-entry content should arm before it reaches the viewport edge and run only once. A generous positive viewport margin avoids observer-late reveals during fast scrolling and keeps reverse navigation calm.
- Decorative timeline rules and nodes can animate while the associated article text stays fully painted. This preserves information availability and materially limits the animated raster area.
- Verify that completed transforms become `none`, not merely an identity matrix retained with compositor hints. The restored hero and Experience details release their transform after settling.
- A reduced-motion check should inspect computed styles, not only configuration. The safe outcome is immediate opacity 1 and transform none for every tested reveal.

## Simplifying decoration and efficiently drawing a long SVG route

- Remove rejected decoration at the source instead of hiding it. Deleting its component, motion setup, local data, and responsive CSS reduces both maintenance and compiled styling while keeping the semantic content unambiguous.
- A shared navigation record should own chapter wording. Changing one label updates the desktop menu, mobile menu, and progress rail while a stable section ID preserves anchors and measurement code.
- Normalize an SVG route with `pathLength="1"`. Progress then becomes a single bounded `strokeDashoffset` write, with no `getTotalLength()` call and no dependence on the route's responsive geometry.
- Cache document-relative start/end metrics during initial layout and resize. A scroll frame should read `scrollY`, do scalar arithmetic, and write one style—not call `getBoundingClientRect()` or update React state.
- Coalesce passive scroll events with `requestAnimationFrame`, skip imperceptibly small deltas, and render the completed stroke for reduced-motion users.
- Superseded by target-device evidence: even one direct dash-offset write per frame can re-raster a document-height SVG and dramatically worsen checkerboarding. For this portfolio, the only verified-safe route is a completed stroke with zero scroll-time SVG mutation.

## Drawing a long route without invalidating a long document

- Bound an animated paint surface to the pixels the user can currently see. A fixed viewport canvas avoids allocating or invalidating an 8,000–11,000 px drawing surface while preserving the document-height SVG as immutable geometry and fallback.
- Cache geometry in the coordinate system used for painting. Converting the responsive SVG route into one paper-scaled `Path2D` means each scroll frame can stroke ordinary CSS-pixel coordinates without rebuilding commands or scaling the line width.
- A fast scroll handler is defined as much by what it does not do as what it does: no React state, bounding boxes, DOM queries, computed styles, ResizeObserver work, or SVG writes belong in the frame callback. Cache those during actual geometry changes.
- Reveal a monotonic route by clipping the viewport canvas to a paper-relative height. The full cached path can be translated by the cached paper offset and stroked once; the viewport clip discards the unrevealed and offscreen portions without mutating route geometry.
- A progressive renderer needs a first-frame handshake. Keep the completed static route visible until context creation, path conversion, sizing, and the first stroke all succeed; only then switch visibility. Any failure should restore the known-good visual immediately.
- Treat reduced motion, print, unsupported APIs, tab visibility, and context loss as renderer lifecycle states. They should remove the scroll listener and expose semantic/static content rather than merely hiding a failed canvas.
- Synthetic scroll checks can prove backing-store limits and zero SVG mutations, but the target Windows browser's native-scrollbar drag remains the acceptance gate for display-level checkerboarding.

## Reusing the bounded-work principle elsewhere

- Reuse the principle, not necessarily Canvas itself: constrain live work to the smallest changing surface, cache stable inputs, and keep a cheap static first paint.
- Pixel treatments that never change should be performed before runtime. Pre-baked or CDN-generated monochrome project images can remove a filter from the browser's scroll-time raster path.
- A bundled local snapshot makes CMS enhancement deferrable. Load remote content after first paint—or use a small direct CDN request—so a public SDK and its transport dependencies do not compete with the initial portfolio render.
- Frame-frequency UI feedback such as a progress range can live in refs and local DOM properties, but measured target-device evidence should decide whether the extra imperative code is worth retaining.
- Do not generalize one successful Canvas overlay into a Canvas-rendered site. Text, links, articles, and section structure are already best served by semantic DOM; Canvas is justified only for the one continuous decorative stroke whose SVG invalidation was proven expensive.
