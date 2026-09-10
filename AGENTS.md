# Portfolio workspace

Read `.agent/CONTINUITY.md` before working. Keep the Canvas route, monospace artwork, flat desktop navbar, and mobile Contact postage flow intact.

## Container workflow (preferred)

- Frontend: `docker build -t jeffrey-portfolio ./frontend_react`, then `docker run --rm -p 8080:80 jeffrey-portfolio`.
- Frontend checks: `docker build --target build -t jeffrey-portfolio-check ./frontend_react`, then `docker run --rm -e CI=true jeffrey-portfolio-check npm test -- --watchAll=false --runInBand` and `docker run --rm jeffrey-portfolio-check node node_modules/eslint/bin/eslint.js src --max-warnings=0`.
- Studio: `docker build -t jeffrey-studio ./backend_sanity`, then `docker run --rm -p 3333:3333 jeffrey-studio`. The image validates `sanity build` before starting the development Studio.
- Docker is unavailable on the current Windows host (2026-09-05). Use already-installed Node/Python as fallback; never install host system packages. Direct Node scripts avoid this host's broken npm PowerShell wrapper. Builds/checks may require sandbox escalation because Node cannot resolve the parent user directory inside the sandbox.

## Checks and content

From `frontend_react`: `node node_modules/eslint/bin/eslint.js src --max-warnings=0`, `node node_modules/react-scripts/scripts/test.js --watchAll=false --runInBand` with `CI=true`, and `node node_modules/react-scripts/scripts/build.js`.

From `backend_sanity`: `node node_modules/sanity/bin/sanity build`. These are local builds, not deployments. Regenerate the tracked frontend build after changes.

Public Sanity reads are unauthenticated. Never put write credentials into the frontend. See `backend_sanity/GALLERY_EDITING.md` for layout fields, launch defaults, and the read-only curation report. Publishing Studio or changing production content requires a separate rollout instruction. New unknown projects default to standard; explicit CMS choices override launch selections.

Use the enabled browser tools for local visual QA. Keep screenshot evidence in `.agent/previews`; do not claim physical touch, Windows GPU behavior, or browser scenarios that were not tested.
