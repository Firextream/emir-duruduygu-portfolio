# Directus schema for duruduygu.com

These are the collections the `directus` content adapter (`lib/content/directus`) reads when `CONTENT_SOURCE=directus`. They mirror `design_handoff_duruduygu/duru-content.js` and are what the mock adapter serves today.

This builds on the existing setup: the same `docker-compose.directus.yml`, `.env.directus.example`, env names and `status = published` rule as `DIRECTUS_SETUP.md`. `DIRECTUS_SETUP.md` still describes the old `gallery_images` and `portfolio_items` collections; the new site doesn't read those.

Every collection except `settings` has a `status` field (`published` / `draft`, default `draft`). The site only shows `published` items.

## Collections

### `photos` (override: `DIRECTUS_GALLERY_COLLECTION`)
The gallery, the photo viewer and every home hero.

| Field | Type | Notes |
|---|---|---|
| `status` | string, dropdown | `published` / `draft` |
| `sort` | integer | Manual order. Enable "Manual sort" on the collection |
| `slug` | string, unique, optional | Used in `/gallery/<slug>`. The item id is used if empty |
| `image` | file (image), required | Shown at its native ratio, never cropped |
| `title` | string | e.g. "Bebek, late light" |
| `alt` | string, optional | Alt text. The title is used if empty |
| `place` | string | |
| `date` | date | Shown as MM.YYYY |
| `camera` | string | |
| `note` | text, optional | Short note in the photo viewer |
| `width`, `height` | integer, optional | Only needed to override the file's own dimensions |

### `mood` (override: `DIRECTUS_MOODBOARD_COLLECTION`)
The Moodboard tab in the gallery.

| Field | Type | Notes |
|---|---|---|
| `status`, `sort` | | As above |
| `image` | file (image) | |
| `title` | string | |
| `source` | string | Credit or URL |
| `width`, `height` | integer, optional | Override |

### `posts` (override: `DIRECTUS_POSTS_COLLECTION`)
The journal. This extends the existing `posts` collection in `DIRECTUS_SETUP.md`: the `title`, `slug`, `excerpt`, `content`, `date`, `read_time`, `cover_image` and `status` fields keep their names.

| Field | Type | Notes |
|---|---|---|
| `status` | string | |
| `slug` | string, unique, required | `/blog/<slug>` |
| `kind` | string, dropdown | `essay` / `video` / `note` |
| `title` | string, required | |
| `excerpt` | text | One line for lists |
| `date` | date, required | The journal groups posts by its year |
| `place` | string | |
| `tags` | tags (JSON array of strings) | |
| `read_time` | string, optional | e.g. "6 min". Computed from `content` if empty. Video posts show `▶ <video_duration>` |
| `standfirst` | text | The large opening lines |
| `content` | text, **Markdown** interface | The body, or the transcript for a video post. See "Post bodies" below |
| `margin_note` | text, optional | The note beside the body (Modernist / Quiet) |
| `cover_image` | file (image), optional | Fig. 01 above an essay or note. Not used for videos |
| `cover_caption` | string, optional | |
| `video_host` | string, dropdown | `YouTube` / `Vimeo` / `File` |
| `video_url` | string | Watch URL (YouTube/Vimeo) or a direct file URL. While it's empty the player shows the poster only, and "Watch on YouTube" is hidden |
| `video_duration` | string | `mm:ss` |
| `video_poster` | file (image, 16:9) | |
| `chapters` | JSON, **Repeater** interface with fields `time` (string, `mm:ss`) and `title` (string) | The chapter list seeks the player. Each chapter should match a `## heading` in `content` |

#### Post bodies (`content`)
This is a small Markdown subset that each skin lays out:

```md
First paragraph… *emphasis*, **strong**, [a link](https://…).

## A subheading            ← for video posts, one per chapter

![Caption](photo:<photo slug or id>) ![Caption](asset:<file id>)   ← two images in one block = a figure pair

> A line worth pulling out.   ← pull quote
```

An image ref can be `photo:<slug|id>` (a published photo), `asset:<directus file id>`, or a pasted Directus asset URL.

### `projects` (override: `DIRECTUS_PROJECTS_COLLECTION`)
The Lab and the project pages.

| Field | Type | Notes |
|---|---|---|
| `status`, `sort` | | Publish status and manual order |
| `slug` | string, unique, required | `/lab/<slug>` |
| `name` | string | e.g. "SLAB-100" |
| `kind` | string | e.g. "Hardware", "Clothes" |
| `one_liner` | string | |
| `stage` | string | The project's status label, e.g. "Prototype 2". It's called `stage` so it can't clash with the publish `status` |
| `year` | string | |
| `tools` | string | |
| `image` | file (image), optional | Shown contained, never cropped |
| `image_caption` | string | |
| `drawing` | file (image or SVG), optional | Shown on white in a box |
| `drawing_caption` | string | |
| `placeholder_ratio` | string, optional | e.g. `4:5`. The proportions of the placeholder shown while there's no image |
| `log` | **O2M alias** → `project_log.project` | The design log |

### `project_log` (override: `DIRECTUS_PROJECT_LOG_COLLECTION`)
| Field | Type | Notes |
|---|---|---|
| `project` | M2O → `projects` | |
| `date` | date | Shown as YYYY.MM.DD, newest first |
| `title` | string | |
| `text` | text | "What changed and why" |

### `settings` (singleton; override: `DIRECTUS_SETTINGS_COLLECTION`)
Mark it as a singleton when you create the collection.

| Field | Type | Notes |
|---|---|---|
| `home_photo_quiet` | M2O → `photos` | `homePhoto.quiet`, the first print in Quiet's frames.dir |
| `home_photo_modern` | M2O → `photos` | `homePhoto.modern`, the Modernist hero (cols 1–9) |
| `home_photo_soft` | M2O → `photos` | `homePhoto.soft`, the Soft Club jewel-case cover (the one place a photo is square-cropped) |
| `email` | string, optional | Defaults to emir@duruduygu.com |

If a home photo is empty, the first published photo with an image is used.

## Permissions
The site reads with `DIRECTUS_STATIC_TOKEN`, or anonymously if the Public role can read. Either way:
- That role needs **read** on `photos`, `mood`, `posts`, `projects`, `project_log`, `settings`, plus a "status = published" item filter on the first four.
- The **Public** role needs **read on `directus_files`**. Browsers load images straight from `<DIRECTUS_ASSETS_URL>/assets/<id>?format=webp&width=…`, and they can't send the token. There's no image proxy any more; that's what made the old site slow.
- Under Settings → Files & Storage, set "Allowed transformations" to **All**, or add presets that cover `format=webp` with widths from 256 to 3840.

## Switching the site to Directus
1. Start Directus: `docker compose -f docker-compose.directus.yml --env-file .env.directus up -d` (copy `.env.directus.example` to `.env.directus` first).
2. Create the collections above in the Directus admin and set the permissions.
3. Add content. Upload the photos, set `settings.home_photo_*` and publish.
4. In `.env.local` (dev), in Vercel → Environment Variables, or in `.env` (Docker), set:
   ```
   CONTENT_SOURCE=directus
   DIRECTUS_URL=https://cms.duruduygu.com        # or http://directus:8055 inside Docker
   DIRECTUS_ASSETS_URL=https://cms.duruduygu.com # public URL for images
   DIRECTUS_STATIC_TOKEN=<read-only token>       # optional
   REVALIDATE_SECRET=<long random string>
   ```
5. Rebuild and redeploy. Pages are static and refresh every 5 minutes (ISR). If Directus can't be reached at build time, they render on the first request instead.
6. For instant updates, create a Directus **Flow**: trigger on Event Hook (items.create/update/delete on the collections above), then a Webhook request `POST https://www.duruduygu.com/api/revalidate?secret=<REVALIDATE_SECRET>&tag=content`.
7. Check `/`, `/gallery`, `/blog` and a post. Use `CONTENT_SOURCE=mock` to switch back at any time.
