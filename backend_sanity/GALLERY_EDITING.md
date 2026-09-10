# Editing the projects gallery

The site uses published Works documents. A project keeps its identity when its title changes. The new fields are independent of the original ImageUrl.

| Field | Behavior |
| --- | --- |
| Gallery presentation | Lead feature spans the gallery. Featured uses two desktop columns. Standard uses three desktop / two tablet columns. All become one column on phones. |
| Gallery order | Nonnegative integer; lower comes first within a presentation group. Use 10, 20, 30 to leave insertion room. Empty values sort last, then by document ID. |
| Gallery media treatment | **Fill frame** is the default. It applies to the original image, an image override, or a video. Choose **Show entire media** for screenshots or portrait demos whose edges must remain visible. |
| Gallery image | Optional replacement for ImageUrl. Add an image description. Crop/hotspot are honored when filling the frame. With a video, this image is its poster. |
| Gallery video | Optional MP4 or WebM upload. The gallery displays native controls and starts playback only when requested. No autoplay or background buffering is requested. Leaving the gallery or hiding the tab pauses playback. |
| Video description, captions, transcript | Describe the demo, upload English WebVTT captions for speech/meaningful audio, and optionally provide a readable transcript or visual description. |

Existing documents do not automatically receive Sanity initial values. An unset treatment renders as Fill frame. An explicit treatment stored in the earlier image override remains supported until you choose the new project-level setting; that setting wins. The legacy nested control is hidden, so there is only one visible treatment option.

Upload browser-compatible video files; the Sanity file field stores and serves the uploaded file, without transcoding it into multiple resolutions. For short demos, export H.264 MP4 or browser-compatible WebM at a sensible resolution/bitrate before upload. Broken videos fall back to the project image. [Sanity file documentation](https://www.sanity.io/docs/studio/file-type). Caption tracks use anonymous cross-origin fetching. [HTML track requirements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track).

## Launch selection and compatibility

The local launch selection gives GitHired lead space, Remembrance and diskovery featured space, and the portfolio an order of 40. These defaults apply only to the verified existing document IDs when their CMS values are unset. **Explicit CMS choices always win**, including Standard and order 0. Unknown or invalid presentation values normalize to Standard. If several projects are Lead, the first by order/ID stays Lead and the rest become Featured. Filtering never promotes a project just because it is first in the results.

This seed is an implementation refinement to the original plan: it makes the approved curation visible without writing to production CMS records. No bulk content mutation was performed. Review the read-only proposal with:

```sh
node scripts/gallery-curation-report.cjs
```

The report preserves existing choices and does not offer an apply mode. Studio publishing and production content curation remain separate rollout steps.

## Images and refresh behavior

An override image takes precedence over ImageUrl. An edited ImageUrl or crop takes precedence over a bundled screenshot. Unchanged, verified assets can use local AVIF/WebP/JPEG variants, with the local image retained as an error fallback. Media fit is separate from this source selection.

Public project metadata uses the versioned `portfolio-projects-v3` browser cache. A delayed CMS response arriving after the gallery has been encountered is saved for the next visit, preventing a layout jump. When checking published edits while already on Work, reload once more after the background refresh. Empty/failed responses and unavailable storage retain the bundled content. The bundled snapshot has nine projects; the production query returned seven during implementation. The frontend displays the full returned published set and does not fabricate unpublished records.

## Validation and rollout

The presentation validation now passes an array to Sanity 3.23.4's `Rule.valid()`. The earlier separate-argument call accidentally allowed only Lead. Run `node scripts/check-gallery-schema.cjs` to exercise the actual installed Sanity validators for every presentation, treatment, and order constraint, then `npm run build`.

Local Studio picks up schema changes through its development server. An already-deployed Studio needs a separate Studio deployment before these controls appear there. This implementation does not deploy either site or Studio.
