# Jeffrey Huang — Portfolio

A single-page React portfolio presented as a continuous scrapbook sheet with full-color project previews. A viewport-sized Canvas draws the route through the chapter stamps as the visitor scrolls, with a static SVG fallback. The fixed navbar and section anchors provide direct navigation; there is no bottom progress bar. It keeps an instant local content snapshot, then refreshes project, skill, and experience data from Sanity when available.

## Stack

- React 18 and Create React App
- Sass
- Framer Motion
- Sanity (public, read-only content delivery)
- Lenis 1.3.26, sharing Framer's frame scheduler
- Self-hosted Newsreader and IBM Plex Sans, Fontsource 5.3.0 (OFL)

## Local development

```bash
npm start
```

The app is served at `http://localhost:3000`.

## Production build

```bash
npm run build
```

## Image optimization

The ASCII hero remains code/text artwork. Known project previews use checked-in responsive AVIF/WebP/JPEG assets. A changed Sanity image or crop takes precedence over a local snapshot. Gallery image overrides can also provide video posters. Regenerate portrait variants with:

```bash
npm run optimize:images
```

This command requires Python and Pillow with AVIF/WebP support.

To refresh a project preview, capture the real interface into `project-sources/<slug>.png`, then run `python scripts/optimize_images.py --project <slug>`. The generator writes 480/800/1200 px variants only when the source is large enough; update the candidate list if introducing smaller sources. The checked-in portfolio screenshot was captured from the redesigned site. Source screenshots stay outside the public build.

## Gallery and design system

The gallery has Lead, Featured, and Standard presentation groups, stable order, normalized category filters, and accessible result counts. Video uploads render with native controls, optional captions/transcripts, no autoplay, and an image fallback. **Fill frame** is the default project-level treatment for both images and video, independent of the optional image override. See [the CMS editing guide](../backend_sanity/GALLERY_EDITING.md).

`src/design-system.scss` owns the editorial type, spacing, and interaction tokens; `src/motion.js` shares Framer timing/easing roles. Newsreader and IBM Plex Sans use Latin weight-only files; the full-width uppercase Projects heading adds a Latin-only League Gothic face in `Work.scss`. These self-hosted fonts total 114,232 bytes (111.6 KiB), within the 150 KiB font budget. They use swap and system fallbacks; the original ASCII monospace geometry is preserved. The Projects heading scales with its container using the fixed word's font metrics; recalculate its size if the heading text changes. Work-specific top padding and heading margins keep this chapter compact. Project descriptions, buttons, links, and transcript controls display in lowercase through CSS, including CMS content, without rewriting stored text or project names.

The mobile navigation is a body portal with a stationary 28 px glass surface, an internally scrolling full-height panel, focus trapping, Escape handling, and background inert/scroll locking through its exit animation. The desktop navbar retains its original geometry and theme cycle. The bottom progress bar remains removed.

## Scrolling and data loading

The Experiences sidebar presents skills as a ruled index with serif category headings, item counts and two-column lists. Groups are Interface, Backend & APIs, Data & AI, and Tools & Platforms; unrecognized CMS skills appear under More tools. Name matching trims whitespace and ignores case, with NodeJS/Node.js supported. All skill labels remain sourced from the existing data. Categories form two columns on tablet and stack on phones; the desktop timeline remains alongside the index.

The Interests rebus in `About/InterestRebus.jsx` combines Newsreader, bold Plex and shared League Gothic with four transparent photo cutouts and a Pokémon logo. Short inline phrase groups keep images with their words; image height scales with the 32–72 px type and proportions are preserved. Dimensions are reserved before lazy loading, failed images become words in the same slot, and one complete sentence supplies the accessible reading order. The visual paragraph has one entrance and is static with reduced motion. Asset provenance and generation prompts are documented in `src/assets/interests/README.md`. The original card illustration is retained as an unused source after the Pokémon replacement.

The profile's `About/CapabilityStack.jsx` provides the three-step reading sequence beneath “Proficient across the whole stack.” All rows start open. Each scroll interval leaves reading time, then closes one detail panel; scrolling upward reverses the sequence. Circle, rounded-square and diamond buttons indicate the active item and navigate back to its reading interval. Row titles are static headings without manual expand/collapse buttons; collapsed details retain hidden-content semantics. All indicators clear when all rows are closed. A fixed scroll track keeps the following sections and anchor destinations stable; the consumed part of the track is above the viewport when the compact titles reach the end. The interests section follows immediately after that compact stage. Reduced motion and viewports too short to display the active content use fully expanded normal flow. The existing diagrams, CMS descriptions, fonts and Canvas route remain in use.

The hero begins as a full-screen paper scene, with staggered name, portrait, summary and link entrances. `Header/useHeroIntro.js` uses the existing Framer Motion scroll values to contract the paper into the original card over `clamp(320px, 75svh, 800px)` of scroll. The section reserves that distance; its stage eases out of its pinned position around the end of the contraction before moving normally with the document. The release completes at most 80 px beyond the reserved distance, without changing the final offset. Only transforms and opacity change during scrolling; layout is measured on resize/font readiness. The composition scales uniformly, independently of the paper rectangle. The navbar returns near the start of the contraction, while card decoration appears near the end. Links and direct hashes bypass the intro normally; scrolling back reverses the collapse. Reduced motion keeps the original static hero and removes the extra scroll distance, including when the preference changes while the page is open. A dedicated media subscription handles that live change because the installed Framer Motion 10 hook only captures the initial preference. Print also omits the intro. The Canvas route measures the hero marker at its final position to preserve its alignment.

Both scroll sequences use a shared quintic easing curve with gentle starts and stops, plus a continuous release into normal scrolling. Profile detail heights and stage position update together in the same scroll callback, with cached nodes and writes only when values change. React state changes only when an item finishes opening or closing. The hero entrance uses smaller offsets and longer timing; its CTA labels are lowercase.

`REACT_APP_SMOOTH_SCROLL=false` disables Lenis for native-scroll comparison or rollback. Rebuild after changing this flag. Smooth wheel input is enabled; touch retains native behavior. Reduced-motion changes are handled by Lenis, CSS and Framer. Anchor navigation maintains hashes/history and destination focus; the skip link is immediate. The root scroll padding is the sole header offset.

CMS fetches remain deferred. A versioned public project cache supplies the next visit; late responses do not rearrange an already-encountered Work section or change preceding copy height. Invalid/unavailable storage and failed/empty responses fall back safely. See the CMS guide for the explicit launch defaults and editing refresh behavior.

## Checks

Run `node node_modules/eslint/bin/eslint.js src --max-warnings=0`, `npm test -- --watchAll=false --runInBand` with `CI=true`, and `npm run build`. In `backend_sanity`, run `node scripts/check-gallery-schema.cjs` and `npm run build`. The schema check uses installed Sanity validators, including all three presentation options. See the root AGENTS.md for container commands and the installed-tooling fallback on this Windows host.

Validation evidence and the remaining physical-device checks are recorded in `.agent/DESIGN_IMPLEMENTATION_REVIEW.md` at the repository root.

## Environment

`REACT_APP_SANITY_PROJECT_ID` may be set to override the public project ID. Do not place Sanity write tokens in `REACT_APP_*` variables; Create React App exposes those values to the browser bundle.

## Container build

```bash
docker build -t jeffrey-portfolio .
docker run --rm -p 8080:80 jeffrey-portfolio
```

The container builds the static app and serves it with Nginx, including immutable caching for fingerprinted assets and SPA routing fallback.
