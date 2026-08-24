# Jeffrey Huang — Portfolio

A single-page React portfolio presented as a monochrome physical book. One stationary bound cover sits beneath a decreasing deck of overlapping warm-paper leaves; native scroll position turns only the active paper surface with a spring-smoothed, reversible transform and never intercepts wheel input. Page-edge anchors, the fixed navigation, and the keyboard-accessible progress range provide direct navigation. It keeps an instant local content snapshot, then refreshes project, skill, and experience data from Sanity when available.

## Stack

- React 18 and Create React App
- Sass
- Framer Motion
- Sanity (public, read-only content delivery)

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

The hero portrait and known project previews use checked-in responsive AVIF and WebP assets. Sanity can update project copy and links without replacing those local snapshots. Regenerate the image variants after changing source imagery:

```bash
npm run optimize:images
```

This command requires Python and Pillow with AVIF/WebP support.

## Environment

`REACT_APP_SANITY_PROJECT_ID` may be set to override the public project ID. Do not place Sanity write tokens in `REACT_APP_*` variables; Create React App exposes those values to the browser bundle.

## Container build

```bash
docker build -t jeffrey-portfolio .
docker run --rm -p 8080:80 jeffrey-portfolio
```

The container builds the static app and serves it with Nginx, including immutable caching for fingerprinted assets and SPA routing fallback.
