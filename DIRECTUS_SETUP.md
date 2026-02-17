# Directus Setup (Vercel + External CMS)

This project now supports `Directus` as the primary CMS.
If `DIRECTUS_URL` is set, the app reads from Directus. If not, it falls back to existing Notion/mock behavior.

## 1) Directus Collections

Create these collections in Directus:

### `posts`
- `title` (string, required)
- `slug` (string, unique)
- `excerpt` (text)
- `content` (text)
- `date` (date or datetime)
- `category` (string)
- `read_time` (string, optional)
- `featured` (boolean, optional)
- `cover_image` (file)
- `author_name` (string, optional)
- `author_title` (string, optional)
- `author_image` (file, optional)
- `status` (string, optional: `published` / `draft`)

### `gallery_images`
- `title` (string)
- `alt` (string, optional)
- `image` (file, required)
- `place` (string, optional)
- `category` (string, optional)
- `aspect_ratio` (string, optional, e.g. `4/3`)
- `width` (integer, optional)
- `height` (integer, optional)
- `selected` (boolean, optional)
- `featured` (boolean, optional)
- `camera` (string, optional)
- `lens` (string, optional)
- `aperture` (string, optional)
- `shutter_speed` (string, optional)
- `iso` (integer, optional)
- `focal_length` (string, optional)
- `date` (date or datetime, optional)
- `status` (string, optional: `published` / `draft`)

### `portfolio_items`
- `title` (string)
- `description` (text, optional)
- `category` (string, optional)
- `image` (file, required)
- `place` (string, optional)
- `date` (string/date, optional)
- `status` (string, optional: `published` / `draft`)

## 2) Vercel Environment Variables

Set these in Vercel Project Settings -> Environment Variables:

- `DIRECTUS_URL=https://your-directus-domain.com`
- `DIRECTUS_STATIC_TOKEN=...` (optional if public role can read collections)
- `DIRECTUS_POSTS_COLLECTION=posts` (optional)
- `DIRECTUS_GALLERY_COLLECTION=gallery_images` (optional)
- `DIRECTUS_PORTFOLIO_COLLECTION=portfolio_items` (optional)

## 3) Directus Permissions

In Directus, ensure the role used by your token can `read`:
- `posts`
- `gallery_images`
- `portfolio_items`
- `directus_files` (for asset URLs)

If using public access instead of token, set read permissions on those collections for the Public role.

## 4) Optional: DigitalOcean Deployment Path

Minimum low-cost setup:
- 1x Ubuntu Droplet
- Docker + Docker Compose
- Reverse proxy (Nginx/Caddy)
- Directus + Postgres

Point `DIRECTUS_URL` to your Directus domain and redeploy Vercel.

## 5) Quick Validation

After deployment:
- `/blog` shows Directus posts
- `/gallery` shows Directus images
- `/portfolio/[id]` resolves with Directus item IDs
- `/api/test-gallery` returns non-empty images

