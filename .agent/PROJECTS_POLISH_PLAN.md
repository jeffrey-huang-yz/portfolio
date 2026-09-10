# Portfolio design and implementation plan

Implementation status, 2026-09-05: the source changes and local builds are implemented. See `DESIGN_IMPLEMENTATION_REVIEW.md` for verification and the remaining device/rollout checks. The user's follow-up supersedes the contain default: Gallery media treatment is now a separate project-level field defaulting to Fill frame, and videos are supported. Launch defaults for verified existing project IDs supply the approved initial curation without a production CMS mutation; explicit CMS choices win. Weight-only Latin font files keep the selected font pair within the transfer budget.

Prepared 2026-09-05T01:44:35-04:00. Status: proposed implementation plan; application changes have not started.

Expanded 2026-09-05T02:02:18-04:00 to cover overall style, typography, space, section composition, motion, and implementation tools. New recommendations below are design judgments grounded in the current site; measured facts remain identified separately.

## Outcome and visual direction

Make Jeffrey's engineering portfolio feel deliberately curated: a few substantial project presentations, clear supporting work, restrained motion, and a legible mobile navigation surface. Keep the continuous paper, chapter stamps, Canvas route, oversized projects heading, full-color media, and automatic/light/dark theme cycle. The bottom progress bar remains removed.

Use the existing palette: paper `#f1e8d1`, elevated paper `#f7efd9`, ink `#090908`, secondary ink `#57544c`, light chrome `#fafaf7`, and dark chrome `#080808`. The expanded recommendation supersedes the earlier system-font-only approach: trial self-hosted Newsreader for editorial roles and IBM Plex Sans for supporting text, retaining Times/system stacks as fallbacks and a comparison baseline. Preserve the ASCII portrait's existing monospace metrics. Apply the chosen editorial font at regular weight to mobile navigation.

The signature is a large, carefully composed project image on the paper sheet. Spend visual emphasis there; keep categories, controls, and captions quiet. Proposed desktop composition:

```text
projects
quiet category controls

[                 lead project image                  ]
project title                       contribution / links

[     featured project      ] [     featured project    ]
caption and links             caption and links

more projects
[ compact image + caption ] [ compact image + caption ] ...
```

Below the existing 620 px gallery breakpoint, stack in reading order. Preserve visible differences through image scale, spacing, and caption hierarchy. Above 980 px, standard projects may use three columns; featured projects use two. An unpaired featured project uses the available width without an empty placeholder.

## 0. Establish a coherent design system

Compare these directions using the actual hero, project previews, and open mobile menu at desktop and phone widths. Build temporary browser specimens during implementation, then keep one direction; do not ship a style selector or several competing systems.

| Direction | Character and benefit | Tradeoff for this site | Decision |
| --- | --- | --- | --- |
| Engineer's field journal | Editorial type, technical drawings, precise captions, selected paper artifacts | Requires restraint so the notebook details do not obscure the work | Recommended; directly connects the engineering projects, ASCII portrait, route, and postcard |
| Swiss portfolio | Strong alignment, neutral sans-serif typography, disciplined spacing | Very clear, but would reduce the distinctive physical character | Borrow its grid discipline and readable hierarchy |
| Fashion editorial | Dramatic serif headlines, asymmetry, large images, generous pauses | Can overemphasize identity and make practical project information harder to find | Borrow image scale and typographic contrast; keep project evidence easy to reach |
| Experimental digital studio | Monospace labels, kinetic type, interactive scenes | More motion and visual systems would compete with the existing route and complicate mobile performance | Keep as a future direction only if a project needs an interactive demonstration |

### Typography

Recommended pair: **Newsreader + IBM Plex Sans**. Newsreader provides a reading-oriented serif with weight and optical-size variation; Plex supplies a consistent sans-serif with an engineering association. Both upstream projects provide open font licenses. [Newsreader upstream](https://github.com/productiontype/Newsreader), [IBM Plex upstream](https://github.com/IBM/plex)

An alternate specimen can use Instrument Serif for a more dramatic masthead, paired with the same Plex body. Instrument is intended for large display use and supplies regular/italic styles, so do not apply the site's existing heavy weights to it. Keep the alternate a specimen, not another shipped family. [Instrument Serif upstream](https://github.com/Instrument/instrument-serif)

| Role | Proposed treatment | Starting size/measure |
| --- | --- | --- |
| Name and projects masthead | Preserve the mixed sans/serif identity and distinctive large scale; retune tracking for actual glyphs | Fluid sizing based on available width, with no clipping or fixed tall spacer on phones |
| Section headings and mobile menu | Newsreader regular, comfortable line height; lowercase only where already part of the site's voice | Section headings about 40–88 px; menu links about 32–56 px, responsive |
| Project titles | Plex medium/semibold with less negative tracking | 24–36 px; allow long names to wrap naturally |
| Body and project descriptions | Plex regular, consistent paragraph rhythm | 16–18 px, line height about 1.55–1.7, roughly 55–65 characters per desktop line |
| Navigation, categories, dates | Plex medium; color and placement provide hierarchy | 12–14 px for readable metadata, at least the existing navigation size |
| ASCII artwork | Existing monospace stack and whitespace | Preserve glyph aspect ratio and line height exactly |

- Introduce shared editorial/body/display/utility tokens. Replace intended hardcoded Times roles explicitly; changing only the current `--display-font` would miss them. Map current 720–800 weights to deliberate supported weights rather than carrying them over blindly.
- Prototype real strings: Jeffrey Huang, projects, Experiences, let's connect!, the longest project title, and every menu link. Inspect Windows, macOS/iOS, and Android rendering, thin strokes, zoom, and fallback wrapping.
- Use `@fontsource-variable/newsreader` and `@fontsource-variable/ibm-plex-sans` through the existing build pipeline. Pin versions when implementing; retain license files. Choose one optical-size/weight bundle for Newsreader and the necessary weight bundle for Plex, import only used styles, and preserve `font-display: swap`. Avoid duplicate axis bundles. [Fontsource installation](https://fontsource.org/docs/getting-started/install), [variable font delivery](https://fontsource.org/docs/getting-started/variable)
- Keep the first-visit font transfer small: target at most 150 KiB for requested font assets, measure actual requests, and compare a smaller static-style build if needed. Preload only a measured first-screen dependency. Use fallback metric adjustments if they reduce measured layout shift; avoid hiding text while fonts load.
- Font loading changes layout: verify that ResizeObserver-driven route geometry updates after font reflow, and that hashes/Lenis measurements stay correct. Retain a fully readable fallback if font files fail.

### Space and alignment

- Introduce a shared spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, and 160 px, expressed with rem/fluid tokens. Start chapter gaps around 80–144 px on desktop and 48–80 px on phones; make project-group spacing generous within that rhythm.
- Align heading edges, image edges, captions, and rules to one internal grid. Preserve the intentionally alternating Profile/Experiences placement within explicit grid tracks rather than accumulating unrelated offsets.
- Use whitespace to separate actual ideas. Remove oversized mobile heading minimum heights that create an empty screen, while reserving explicit clearance for chapter stamps. Keep the large projects word as a focal point without forcing desktop proportions onto a phone.
- Establish three widths: the broad paper sheet, a content grid, and a narrower reading measure. Long capability paragraphs should not inherit the full image width. Use CSS Grid, `clamp`, and existing container queries; add readable fallbacks where a newer CSS feature is optional.
- Use balanced wrapping on headings and progressive `text-wrap: pretty` for suitable paragraphs, with ordinary wrapping as fallback. Avoid hand-inserted line breaks that fail at neighboring viewport widths. [CSS text wrapping](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/text-wrap)

### Paper, color, and interaction details

- Keep the outer torn edge, chapter stations, ASCII portrait, and Contact postage as recognizable details. Reduce the contrast of dense inner line textures and the number of overlapping shadows so the page reads as a well-produced journal.
- Give depth a clear purpose: one restrained paper shadow, a light image edge when needed, and a consistent thin rule. Review repeated tape pieces individually; keep them where they reinforce the composition instead of automatically decorating every boundary.
- Preserve the warm paper in both themes and the existing cinnabar timeline as the Experiences focal point. Project imagery supplies most other color. Use full-strength ink for essential copy; a premium treatment must remain readable.
- Replace the current global 3D hover/pressed rules on all anchors/buttons with explicit component treatments. Body links get a clear underline, navigation gets its established active rule, controls get a quiet color change, and project links get a short directional-arrow movement. Preserve visible keyboard focus and sufficiently large hit areas.
- Keep a consistent arrow/icon size and stroke. Reuse existing inline SVG/arrow assets or individual icons from the already-installed library; no additional icon collection is needed.

Acceptance: the hero, gallery, Profile, Experiences, Contact, and menu look related; all text is readable on phones; spacing is systematic; and removing animation still leaves a complete, distinctive composition.

## Verified starting point

- Lockfiles contain React 18.2.0, Framer Motion 10.17.9, and Sanity Studio 3.23.4. Keep these major versions; do not combine this work with a framework or Studio upgrade.
- Work currently promotes `:first-child` and uses its array index to choose image sizes. The CMS query orders by `_updatedAt`, so a copy edit can change the largest project.
- The filters use lowercase labels as values, whereas data uses `Website`, `React JS`, and `All`. All three current controls can return an empty collection.
- Remote projects inherit local images through a title match, which can mask CMS image changes and break when a title is renamed.
- Browser inspection at 530x693 measured the header at 76 px and the open drawer at only 75 px. Links overflow below the drawer background. The drawer has no backdrop filter and its links use the sans-serif display font at weight 650.
- The header's backdrop filter establishes a containing block for its fixed descendants. Moving the overlay outside that ancestor addresses the drawer geometry rather than just increasing background opacity. [CSS filter specification](https://drafts.csswg.org/filter-effects-2/#BackdropFilterProperty)
- The Canvas route reads actual `window.scrollY`, caches geometry, and draws a viewport-sized surface. Prior Windows native-scrollbar flicker makes before/after device testing essential.
- Global `App.scss` currently adds offset layered shadows, background changes, and translation to nearly every link/button, requiring local exceptions. A shared interaction cleanup will remove those conflicts.
- Fonts currently vary by platform through Aptos/Segoe/Helvetica fallbacks, while serif headings hardcode Times. Several labels are below 12 px, and Work's narrow-screen heading has large fixed minimum heights. These are concrete targets for the shared typography/space pass.

## 1. Fix mobile navigation and establish shared chrome tokens

Primary files: `frontend_react/src/component/Navbar/Navbar.jsx`, `Navbar.scss`, `frontend_react/src/index.css`, and relevant shared interaction rules in `App.scss`.

- Render the modal through a React portal attached outside the filtered header. Keep a viewport-level overlay and a separate panel; use `100dvh` with a suitable fallback, safe-area padding, and internal vertical scrolling for short screens and zoom.
- Use the navbar's exact theme-aware `--chrome` surface (currently 0.82 opacity), `--chrome-ink`, and shared `--chrome-blur: 28px` for the drawer. Include prefixed/unprefixed backdrop-filter and a solid-color fallback when blur is unsupported. Keep a single blurred surface over each area.
- Use regular-weight serif navigation links, lowercase labels, restrained rules, and the existing body font for utility text. Inactive links use the theme's muted ink; active and focused links use full ink and an underline. Keep close/touch targets at least 44 px.
- Account for portal styling: move chrome interaction tokens and flat hover/pressed overrides out of selectors that depend on `.site-header` ancestry. Preserve desktop navbar sizing and alignment.
- Retain dialog labeling, focus trap, and Escape behavior; make the background inert while open. Restore focus to the trigger for dismissal, or to the section heading after navigation. Close safely if the viewport crosses the desktop breakpoint.
- Keep the glass background stable while animating a small inner-content translation/fade over roughly 180–240 ms. Handle exit with AnimatePresence if an exit animation is retained. Reduced motion is immediate. Keep scrolling locked through the exit, then restore the original styles.

Acceptance: the panel covers its intended viewport height, content is visibly blurred underneath it, links are legible in both themes, long menus scroll independently, and every close path restores scrolling and focus.

## 2. Give Sanity explicit control over project presentation

Primary files: `backend_sanity/schemas/works.js`, `frontend_react/src/data/portfolio.js`, `frontend_react/src/hooks/usePortfolioData.js`, and a small pure project-normalization module if needed.

| Field | Studio control | Website behavior |
| --- | --- | --- |
| `presentation` | Project emphasis: Lead feature / Featured / Standard | Full-width opening project / generous two-column feature / compact supporting project |
| `displayOrder` | Optional nonnegative integer; lower numbers first | Stable ordering within each presentation group |
| `galleryImage` | Optional presentation image, with hotspot, alt text, and contain/cover fit | Purpose-composed preview; overrides the legacy image when supplied |

- Store `presentation` as a predefined string selector with values `lead`, `featured`, and `standard`; default new documents to `standard`. Sanity supports titled string choices and radio controls. [Sanity string fields](https://www.sanity.io/docs/studio/string-type)
- Normalize missing or unknown presentation values to `standard` and missing orders to a stable trailing position; break ties by canonical document ID. Existing documents must remain visible. Initial values apply to new documents, so provide frontend compatibility rather than assuming old documents are backfilled. [Sanity initial values](https://www.sanity.io/docs/studio/initial-value-templates)
- Recommend one lead. If several are marked lead, render the first by explicit order as lead and the remainder as featured; document that rule in Studio. Zero lead or zero featured must also produce a complete layout.
- Project promotion must come from `presentation`, never the filtered array index. Filtered-out leads do not automatically promote a standard project. Preserve DOM reading order and do not use dense CSS placement that visually reorders links.
- Project the new fields in GROQ. Replace `_updatedAt` ordering with stable editorial ordering and update the bundled snapshot with the same normalized contract.
- Match remote data and local asset fallbacks by verified canonical IDs, using a read-only reconciliation of the current records. Eliminate runtime title-based identity. New CMS gallery images must take precedence; if a legacy CMS image changes, use it rather than silently forcing a stale local snapshot.
- Keep legacy `imgUrl` and local assets as compatibility/failure fallbacks. Generate the deployment snapshot from the same published project choices. Apply structural CMS refreshes before Work is encountered; if a late response would reorder or resize already-viewed projects, save the normalized public project metadata in a small versioned local cache for the next page load. Validate cached data and fall back to the bundled snapshot when storage is unavailable or invalid. Do not jump the layout under the reader.
- Prepare a reviewable curation list: GitHired as a lead candidate, Remembrance and diskovery as featured candidates, and the remaining work as standard. These are proposed choices, not published CMS edits. Any bulk content population must first emit a dry-run report and preserve existing explicit values.

Acceptance: changing emphasis or order in the local Studio/preview changes the intended card, edits to descriptions do not reorder projects, renamed titles retain identity, and old/missing fields and offline data work correctly.

## 3. Build the gallery and improve its images

Primary files: `frontend_react/src/container/Work/Work.jsx`, `Work.scss`, `frontend_react/src/imageUrls.js`, project assets, and the image optimization script.

- Replace enclosing card boxes with image-led presentations and captions on the paper. Start with 32–48 px column gaps and 64–96 px between major desktop groups, scaling down on mobile. Keep project titles, one concise factual contribution, category metadata, and live/source links easy to scan.
- Move technology tags below images. Preserve all projects in the compact supporting collection. Do not add case-study buttons unless a real case study exists.
- Refresh the portfolio thumbnail. Compose web previews with readable UI and intentional margins; preserve portrait proportions for Active Quest; present hardware work with a clear diagram/photo crop. Retain original image colors and avoid enlarging low-resolution captures beyond useful detail.
- Support a simple fit choice on the optional gallery image (`contain` by default for UI screenshots; `cover` for deliberately cropped compositions). When cover is selected, pass the image object, target dimensions, and crop/hotspot through Sanity's image builder so CSS does not blindly crop again. Existing Studio already enables hotspot; retain the Studio 3-compatible boolean API. [Sanity image fields](https://www.sanity.io/docs/studio/image-type)
- Keep AVIF/WebP and fallback formats, explicit dimensions/aspect ratios, async decoding, and lazy loading below the fold. Update every source's `sizes` for the actual lead/featured/standard widths; add larger variants only where the lead genuinely needs them. Retain media-only `content-visibility` and the viewport-bounded route.
- Fix filters with separate display labels and canonical data values; use an explicit `all` sentinel independent of tags. Only expose useful available categories, preserve a real empty state, and announce result counts. Filtering must not hide a large paper surface behind a long opacity animation.
- Limit hover to a subtle image change and short link feedback, with equivalent keyboard focus. Keep whole-card lift/shadow effects out of the new gallery. Do not add parallax, pinning, autoplay video, or continuous decorative motion in this pass.

Acceptance: no cropped essential interface labels, no stale preview overrides, no layout shifts from image loading, correct image candidates at DPR 1/2, working filters, and no missing projects.

## 4. Refine each section using the shared system

Primary files: Header, About, Skills, and Footer components/styles, plus shared PaperPanel/SectionShell styles. Keep the existing section order and anchor IDs.

| Section | Specific change | Intended result |
| --- | --- | --- |
| Hero | Preserve the name lockup and ASCII portrait; align the summary to the same grid; add restrained `view selected work` and `get in touch` text links | Visitors can understand the person and reach the work immediately |
| Profile | Keep the technical schematics and interests; draft shorter, factual capability descriptions with readable line lengths and less repeated self-description | More useful information per glance, with personal details given room |
| Projects | Apply the CMS-led composition, image, caption, and archive changes in stage 3 | The strongest work receives clear visual emphasis |
| Experiences | Keep the red timeline and aligned nodes; clarify role/company/year hierarchy; group all existing skills under simple labels with a fallback group for unknown values | Faster scanning without adding proficiency meters or reviving removed graphics |
| Contact | Preserve the postcard and casual invitation; make the email the strongest actionable element and align the social links/return link to the shared system | A clear and memorable ending |

- Draft content edits using only existing facts. Do not invent impact metrics, testimonials, availability, or project results. Keep content ownership in Sanity where it already exists; proposed copy is separate from production publishing.
- Keep the hero links visually quiet and route them through the same accessible internal-navigation behavior as the navbar.
- Preserve the mobile Contact stamp's normal-flow placement and the approved heading-to-introduction relationship. Recheck every stamp/route marker after font and spacing changes. Do not reintroduce the center fold, character-count caption, navbar brand, or removed Experiences graphics.
- Add a calm theme transition only to small chrome/control surfaces where it helps continuity. Avoid animating large paper layers or changing the theme's established semantics.

Acceptance: each chapter has one clear focal element, a useful reading order, and consistent links/type/spacing; no earlier mobile overlap or removed-decoration regressions.

## 5. Add Lenis and coordinate the motion system

Target `lenis@1.3.26`, verified on 2026-09-05 against the official release and package metadata. Its React peer range supports React 18. Use the current `lenis` package and its `lenis/react` entry. [Tagged package manifest](https://github.com/darkroomengineering/lenis/blob/v1.3.26/package.json)

Primary files: frontend package/lockfile, a small root `SmoothScroll` component, `App.js`, `index.css`, Navbar navigation integration, and `PaperJourney.jsx` only if frame synchronization requires it.

- Mount one root ReactLenis instance, keeping window/document scrolling. Import its stylesheet. Set `autoRaf: false` and drive the instance from the existing Framer Motion `frame.update`, cancelling that callback on cleanup. Do not introduce another permanent animation loop. [Official React/Framer integration](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/react/README.md#framer-motion-integration)
- Proposed tuning: `smoothWheel: true`, `syncTouch: false`, `wheelMultiplier: 1`, `lerp: 0.12`, `infinite: false`, and `autoResize: true`. Tune lerp around 0.10–0.16 on real devices; leave duration/easing unset. Keep touch gestures native and retain keyboard/scrollbar control. These tuning values are design starting points.
- Set `respectReducedMotion: true`. Version 1.3.26 handles preference changes and immediate reduced-motion navigation; verify the site's existing reveal policy alongside it. Scope CSS `scroll-behavior: auto` while Lenis is active to prevent competing browser interpolation. [Lenis release](https://github.com/darkroomengineering/lenis/releases/tag/v1.3.26)
- Keep real hash links. Use one internal-navigation helper for unmodified same-page activations, preserving hashes/history and destination focus; keep Lenis's automatic anchor interception disabled to avoid duplicate handling. Exclude résumé, downloads, external links, modified clicks, and skip-link behavior from decorative smoothing. Support initial hashes and Back/Forward without duplicate movement.
- Consolidate header clearance into one authoritative offset. The tagged implementation accounts for root scroll padding and target scroll margin; avoid counting the header again in a manual offset. [Tagged scrolling implementation](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/core/src/lenis.ts)
- On menu open, stop Lenis and lock native background scrolling; allow the drawer's own scroll region via `data-lenis-prevent`. Dismiss, finish exit, release locks, then navigate. Restore the exact original overflow styles and prevent residual inertia on close. [Lenis stylesheet](https://github.com/darkroomengineering/lenis/blob/v1.3.26/packages/core/lenis.css)
- Initially retain the Canvas route's bounded, event-driven renderer using real scrollY. If measurements show a frame of lag, schedule drawing after the Lenis update on the shared scheduler; retain native/reduced-motion/static fallback paths and avoid duplicate draw subscriptions.
- Keep Lenis behind one internal enable switch for comparison and rollback. It changes the feel of scrolling; it is not evidence that the prior GPU/raster flicker is fixed. Test the documented Safari and iframe limitations as applicable. [Lenis limitations](https://github.com/darkroomengineering/lenis/blob/v1.3.26/README.md#limitations)

Acceptance: input feels responsive without a long drifting tail, menu opening stops movement, hash navigation lands below the header, Canvas stays aligned, preference changes are honored, and disabling Lenis restores functional native scrolling.

Use a small set of shared motion tokens rather than assigning every component its own unrelated animation. These timings are proposed tuning values, not universal rules:

| Moment | Proposed behavior | Timing |
| --- | --- | --- |
| Hero introduction | Name and portrait settle into place together; preserve the artwork rather than morphing its glyphs | Roughly 600–800 ms total, short staggering |
| Section details | Existing contracted viewport threshold, once per visit; small internal details only | 450–600 ms, about 8–12 px of movement |
| Link/control feedback | Color/underline or a 2–3 px arrow movement; no whole-card bounce | 140–200 ms |
| Mobile menu | Stable blurred surface, short content entry and exit | 180–240 ms |
| Filter results | Immediate functional update with a short, local transition; no animated page-height collapse | About 180–220 ms |
| Journey route | Existing scroll-linked viewport Canvas | Driven by actual scroll position |

- Centralize the ease-out curve and duration roles in the existing CSS/Framer system. Keep strict LazyMotion, `m` components, and React 18-compatible APIs already available in Framer Motion 10.17.9.
- Preserve the readable scroll-entry threshold already tuned with the user. Avoid replacing it with a positive viewport margin that completes animations offscreen.
- Apply the existing `MotionConfig reducedMotion="user"` and explicit `useReducedMotion` branches; reduce or remove physical movement and immediately expose essential content. Do not assume the global flag alone disables every opacity/color animation. [Motion accessibility guidance](https://motion.dev/docs/react-accessibility)
- Do not add magnetic cursors, scroll pinning, a splash loader, repeated letter-by-letter headings, or decorative WebGL to this pass. Reconsider interactive project demos separately when a real project would benefit.

## Tools and dependency decisions

| Tool | Role in implementation | Decision |
| --- | --- | --- |
| Existing React 18 + Sass/CSS | Layout, shared tokens, component styling, responsive typography | Reuse; no CSS-framework migration |
| Existing Framer Motion 10.17.9 | Coordinated entry/exit, reduced motion, shared frame scheduling | Reuse; do not copy newer APIs without checking the installed version |
| Lenis 1.3.26 | Wheel smoothing and coordinated programmatic scrolling | One new runtime behavior dependency, as already planned |
| Fontsource font packages | Self-hosted Newsreader/Plex assets through CRA | Add only the selected font assets; choose exact versions during implementation |
| Existing Sanity + image builder | Editorial prominence, stable order, image selection/crops | Extend the current schema and pipeline |
| Existing image optimization script | Responsive AVIF/WebP/JPEG previews | Reuse; measure larger lead images before adding variants |
| Browser preview and DevTools | Compare typography, spacing, actual image/font requests, and scroll cost | Use throughout; assess on the user's Windows path |
| Playwright + optional `@axe-core/playwright` | Targeted visual regressions and automated accessibility checks | Development-only tools; supplement with manual keyboard/visual checks |
| Figma | Optional comparison board if browser specimens leave a visual decision unresolved | Helpful design workspace, not a required dependency or external publishing step |
| GSAP/ScrollTrigger, Three.js/R3F, large UI kits | Complex timeline/3D/application systems | Defer: the proposed design is fully expressible with the existing stack plus Lenis |

Playwright supports screenshot comparisons and axe-based accessibility checks; neither replaces manual review. Run visual comparisons in the same browser/OS/font environment, wait for fonts and images, and stabilize animations before capture. [Visual comparisons](https://playwright.dev/docs/test-snapshots), [accessibility testing](https://playwright.dev/docs/accessibility-testing)

This scope adds design decisions, not a collection of libraries. The planned new shipped behavior remains Lenis; typography is delivered as font assets and QA tools stay outside the production bundle. No packages or design files are installed/published in this planning turn.

## 6. Verification and delivery

Implement in the numbered order above, verifying each stage before adding the next. Compare the final result against the baseline with the bottom bar already removed.

- Meaningful automated tests: presentation normalization and stable order; no/one/multiple lead cases; filter mapping; CMS image precedence and renamed identity; menu focus/lock cleanup; navigation with Lenis enabled, disabled, and reduced motion. Retain the four existing Canvas route tests.
- Browser checks: 320, 390, 530, 900, 901, 980, and 1440 px widths; short landscape viewports; light/dark/auto themes; keyboard-only navigation; touch and trackpad; 200% zoom; reduced motion changed live; initial hash and history; delayed/offline CMS; image failures; filtering while scrolled; menu open during inertia and resize across the breakpoint.
- Design/font checks: compare old/new hero, Profile, gallery, Experiences, Contact, and menu at desktop and phone sizes; test slow/blocked font loads, missing cached metadata, long titles, all font weights actually used, and all focus/hover/pressed states. Measure font transfer and layout shift, verify readable metadata, and remeasure route/stamp geometry after font loading.
- Performance checks: inspect actual image candidates and layout shift, record before/after scroll traces, verify no new whole-page filters/transforms or scroll-driven React state. Compare Lenis on/off using wheel, rapid reversal, and the real Windows native scrollbar. Keep the existing Canvas DPR cap and static/print fallback.
- Run frontend lint, tests, and production build plus the Studio build. Record the two existing unrelated lint warnings and tooling notices separately from new failures. Validate through the existing frontend Docker workflow; add/document a minimal Studio container workflow if needed. Docker is currently unavailable locally, so installed tooling is the immediate fallback without host package installation. Document container commands in repository AGENTS.md during implementation.
- Update README, CMS field guidance, image workflow, and continuity. Regenerate tracked frontend build output after source changes.
- Produce local desktop/mobile previews and a summary of CMS fields and content choices. Studio/website deployment and production content edits are later rollout steps; this planning task performs no package installation, deployment, or CMS writes. Use dry-run content reports before any later authorized bulk update and make no destructive record changes.

Done means the whole site follows one intentional type/space/interaction system, the CMS controls project emphasis predictably, the gallery remains complete and readable, mobile navigation has the correct full-height blurred surface and typography, and Lenis passes interaction and performance checks without regressing the existing route.
