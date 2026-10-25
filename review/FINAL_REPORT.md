# duruduygu.com redesign — final report

Branch `redesign-2026`. **Nothing is pushed or merged.**
Date: 2026-10-25. Every check below ran on a production build (`next build`), never the dev server.

## Update, 2026-10-25: content in the repo, Keystatic, Resend

You decided against running a CMS server for now. This replaces sections 4 and 5 (going live, Directus) and closes open items 1 and 2. **GO_LIVE.md** is now the going-live guide and **KEYSTATIC.md** the editing guide.

- **Content source `files` is the default.** `content/` holds YAML for photos, mood, about, milestones and settings, and Markdown with frontmatter for posts and projects. Images are in `public/content/<collection>/<address>/`.
  - All of today's mock content moved there. `npm run check:content -- --parity` shows every getter identical to the old mock adapter.
  - Placeholders keep their `[brackets]`; `npm run placeholders` lists them (302 in 33 files).
  - `mock` and `directus` are still selectable.
- **Keystatic at `/keystatic`.** It saves to local files in dev and commits to GitHub in production.
  - In production nobody gets in without GitHub sign-in, and there's an optional account allow-list.
  - It's never indexed (meta, header, robots.txt).
  - Until the GitHub App exists it answers 503, and the build still passes.
  - **Tested in the real editor** (headless Chrome, local mode):
    - Saving a post, the About page and a photo changes only the edited field on the site.
    - Keystatic escapes the Markdown it writes (`\[…]`, `!\[\[Caption]]\(photo:p04)`) and the parser reads it as before.
    - Keystatic renames images to `image.<ext>` on save. Image URLs now carry a content hash (`?v=`), so a replaced photo can't be served from cache, and Quiet's caption file name comes from the photo's **File name** field.
- **Pages are fully static**; content changes arrive as commits and a redeploy. The tracer no longer copies `public/` (35 MB) into server bundles.
- **Forms go through Resend.**
  - Contact sends a plain-text email; the newsletter creates a contact in a segment.
  - Both have a honeypot and a per-IP rate limit (5 per 10 minutes).
  - Without `RESEND_API_KEY` they return a clear 503.
  - Resend's DNS records are in GO_LIVE.md §5.
- **Clean-up for you:** while testing, one newsletter request reached your real Resend account through the old `RESEND_API_KEY` in `.env.local`, and created the contact `t@example.com`. Delete it in Resend → Contacts. No email was sent: Resend refused every contact message because the domain isn't verified yet.
- **`npm run images`** sizes photos to ≤ 2560 px at quality 82, upright and without EXIF/GPS, and never recompresses twice. GO_LIVE.md §8 says when to move images to Cloudflare R2: about 300 MB of images, a 1 GB repo, or the Vercel image quota.
- **Checks on the final build:** build ✓, `npm test` 6/6, content check ✓, interaction suite 24/24 (the contact success state is now checked without sending mail), six-width audit **0 issues** (12 routes × 4 skins × 6 widths, fresh and cached).

## 1. Status per page and skin

✅ = compared with its reference at 1440 and 390, and the six-width audit (320 / 390 / 768 / 1024 / 1280 / 1440, fresh and cached load) is clean.

| Page | Quiet | Soft Club | Modernist | Original |
|---|---|---|---|---|
| Home | ✅ | ✅ | ✅ | ✅ (no "Featured work" caption card — client decision) |
| Gallery (Photographs tab) | ✅ | ✅ | ✅ | ✅ |
| Gallery (Moodboard tab, `#moodboard`) | ✅ | ✅ | ✅ | ✅ |
| Photo | ✅ | ✅ | ✅ (no grey stage — client decision) | ✅ (white card, as referenced) |
| Journal | ✅ | ✅ | ✅ | ✅ (search + filters) |
| Journal, empty | ✅ | ✅ | ✅ | ✅ |
| Post (essay) | ✅ | ✅ | ✅ | ✅ |
| Post (video, chapters) | ✅ | ✅ | ✅ | ✅ |
| Lab | ✅ | ✅ | ✅ | ✅ |
| Project (SLAB-100) | ✅ | ✅ | ✅ | ✅ |
| Project, long name, no photo (denim) | ✅ | ✅ | ✅ | ✅ |
| About | ✅ | ✅ | ✅ | ✅ (contact form at `#contact`) |
| 404 | ✅ | ✅ | ✅ | ✅ |
| States sheet (rest / hover / active) | ✅ vs `QStates` | ✅ README rules | ✅ vs `OStates` | ✅ vs `OrigStates` |

Shared pieces done in every skin: style menu (4 skins; accents where the skin has them), skin-change curtain, the
Istanbul clock, mobile dock, back-to-top, `feed.xml`, `sitemap.xml`, `robots.txt`, redirects for the old URLs
(`/portfolio` → `/gallery`, `/moodboard` → `/gallery#moodboard`, `/resume` and `/contact` → `/about`, `/blog/archive` → `/blog`).

Commits in this last session:

- `c28c84d` Original Lab and Project
- `be5d870` Original About. It includes the real About text and milestones, a new `title` field on milestones, and SCHEMA.md updated.
- `3fd9d63` Original 404 and states sheet
- `5df49e2` dead-code leftovers
- `354a4c4` and `21bc919` accessibility and layout-shift fixes
- `40739e4` hero `fetchpriority`

## 2. Checks and scores

| Check | Result |
|---|---|
| `npm run build` | passes (type check and lint on). The only lint warnings are in the legacy files `app/api/image-proxy` and `lib/notion.js` |
| Six-width audit, every route × 4 skins | **0 issues**. It covers horizontal scroll, overlapping text, text under 11px, tap targets under 44px, missing `sizes` and cropped photos |
| Interaction checks | **23 / 23 pass**. They cover first visit, skin switch, accent persistence, player, forms, no lazy LCP, and no console or hydration errors |
| Original Home layout shift (throttled 412px load) | 0.063 → **0.0002** (`21bc919`) |

### Lighthouse, Home, production build (`npx lighthouse`, skin forced by cookie)

| Skin | Mobile Perf | Mobile A11y | Desktop Perf | Desktop A11y | Best practices | SEO |
|---|---|---|---|---|---|---|
| Quiet | **86–90** | 100 | 100 | 96 | 100 | 100 |
| Soft Club | **86–87** | 100 | 100 | 100 | 100 | 100 |
| Modernist | 95–96 | 97 | 100 | 97 | 100 | 100 |
| Original | 92 | 100 | 100 | 100 | 100 | 100 |

Ranges are across three runs; mobile Performance moves ±3 points between runs.

**Fixed in this pass:**
- Soft Club's deep aqua catalogue numbers failed contrast (3.99:1). `--deep` went from the README's `#0f7fd6` to `#0d70bc` (4.9:1), a barely visible darkening.
- Original's Selected Work tiles repeated their caption as alt text. They now use `alt=""`; the link already carries the title.
- Hero images now request `fetchpriority="high"`. Next 15's `priority` prop alone left them at Low.

**Tried and reverted:** `experimental.inlineCss`. It inlined Soft Club's many `@font-face` blocks into the HTML and the RSC payload (224 KB), and scores dropped (Quiet 79).

**Still under 90:** mobile Performance for Quiet and Soft Club. See open item 3.

### Standalone server smoke test (step 3)

**Docker is not installed on this machine, and neither is WSL, which Docker Desktop needs.** So the image itself was **not built**.

I ran the exact runtime the image runs instead:
- `.next/standalone` + `.next/static` + `public`, laid out as the Dockerfile copies them;
- `node server.js` with `NODE_ENV=production`, `PORT`, `HOSTNAME=0.0.0.0`;
- no `.env` file, so mock content.

Results:

- `/`, `/gallery`, `/gallery/p01`, `/blog`, `/blog/long-title`, `/lab`, `/lab/slab-100` and `/about` return **200** in all 4 skins. A missing page returns **404** with the skin's 404 page. `feed.xml`, `sitemap.xml` and `robots.txt` return 200.
- The image optimizer serves AVIF (sharp works in standalone). Static chunks return 200, `/portfolio` returns 308 to `/gallery`, and a first visit with no cookie gets a random skin plus the cookie. `POST /api/contact` returns `{"ok":true}`.
- The headers Cloudflare Tunnel adds (`X-Forwarded-Host`, `X-Forwarded-Proto: https`, `CF-Connecting-IP`) work: 200, internal rewrite.
- Response times were 5–25 ms for pages, 30–70 ms for the 404.
- No `.env*` file ends up in the standalone output, and `.dockerignore` excludes them from the build context.

**Memory** (Node 22, Windows host; expect similar under Alpine):

| Point | Working set | Private |
|---|---|---|
| Idle after start | 119 MB | 136 MB |
| After ~340 page requests | 154 MB | 174 MB |
| After 360 more | 157 MB | 177 MB (flat, no leak) |
| After 3 fresh image transforms (sharp) | 177 MB | 202 MB |

A 512 MB container limit is comfortable. The server was stopped afterwards.

**Gotcha found:** with `HOSTNAME=127.0.0.1` (bound to one IP) every page answers 308. The cause:
- Next treats the middleware's skin rewrite as a cross-origin URL and proxies it to itself.
- The proxied `/quiet/...` request then hits the middleware's "skin trees are internal" redirect.

`HOSTNAME=0.0.0.0`, which the Dockerfile sets, works. Keep it that way, including when running without Docker behind cloudflared.

## 3. Open items

**Before launch**

1. **The forms don't deliver anything yet.** `/api/contact` (every skin's About page) and `/api/newsletter` (the newsletter form on Original's Home) validate the input, check the honeypot and log one redacted line. Then they answer `ok`, and the message is dropped. Either wire them to a provider before launch (the previous Resend version is in git history; it needs `RESEND_API_KEY`), or accept that for now.
2. **Content is still the mock.** Until Directus is live, the site shows `lib/content/mock`, which keeps the handoff placeholders:
   - Photo titles and places: `[Photo title]`, `[Place]`, `[MM.YYYY]`, `[Camera — placeholder]`.
   - Journal: `[Entry title — placeholder]` posts, `[Video essay title — placeholder]`, `[Chapter title]`.
   - Projects: `[year]`, `[status]`, `[tools — placeholder]`, `[Stage 1–4]`, and the design log's `[Note title — placeholder]` / `[YYYY.MM.DD]`.
   - About: `[What I'm working on now — placeholder]`, `[Study — placeholder]`. The About body and milestones are real.
   - In the skins' own copy: Soft Club About's `[Series — placeholder]` / `[Album — placeholder]`, Modernist Home's `[Track title]` / `[Artist]`.

   Either fill Directus first (section 5), or launch knowingly with placeholders.
3. **Mobile Performance for Quiet (86–90) and Soft Club (86–87).** Network isn't the problem: the hero image arrives in about 30 ms. A trace shows a cold-browser rendering cost before first paint:
   - Soft Club: a 160 ms layout pass (Japanese and Doto text shaping) plus 226 ms of GPU raster for the foil gradients.
   - Lighthouse multiplies both by its 4× CPU throttle and starts a fresh Chrome each run.
   - A second load in the same browser paints in about 100 ms.

   Options, none of them small:
   - (a) Fewer Zen Kaku weights: it loads 400/500/700/900 at 27 KB each with the Japanese glyphs.
   - (b) Simpler disc/foil gradients.
   - (c) `content-visibility: auto` on below-the-fold Home sections. This changes how full-page screenshots and the audit see the page.

   Recommendation: after deploy, measure on the real URL with PageSpeed Insights (real CDN, real field data) before changing the design.
4. **Legacy API routes; remove them before Directus goes live.** These are from the old site; the new UI doesn't call them:
   - `/api/image-proxy` and `/api/download` fetch **any** URL given in `?url=`. That is an open proxy and SSRF.
   - Worse: once `DIRECTUS_STATIC_TOKEN` is set, `image-proxy` attaches it to Directus asset requests. Anyone could then read private files through it.
   - `/api/test-notion` returns the first 10 characters of the Notion token.
   - `/api/test-gallery` and `/api/gallery` are Notion debugging routes.

   I kept all of them as the plan said. Deleting them is one commit (plus `lib/notion.js`, `lib/image-utils.ts`, the `scripts/*notion*` tools and `@notionhq/client`), unless you still want the Notion migration scripts.
5. **Rotate the Notion token.** `.env.local.example` (untracked, git-ignored, never committed) contains what looks like a real Notion token.

**Worth a look**

6. **Accessibility items left as they are (scores 96–97):**
   - Modernist's signature red `#ec3013` on `#f3f2f2` is 3.75:1 for the small Home numbers and the Spotify line.
   - One desktop-only line in Quiet's Home window is 4.27:1.

   Both are design colours, so I didn't change them; Soft Club's deep aqua was the only colour I adjusted.
7. **Original details that are hard-coded:**
   - The About stats (500+ / 1 / 15 / 1) and the three Interests cards are the live site's copy, set in `OrigAbout.tsx`.
   - The footer's "Not playing" is static. So is Modernist Home's Spotify line (`[Track title]` / `[Artist]`): no skin calls `/api/spotify/now-playing` yet.
8. **Soft Club generic obi** for later projects (手作りの機械 / 仕立ての服): a native speaker should check it.
9. **The Docker image itself hasn't been built.** Run `docker build -t duruduygu-web .` once on the Oracle VM or the home server and repeat the smoke test there (the commands in `Dockerfile`).
10. **Directus on Oracle Cloud (`deploy/oracle/`)**, your earlier request, is the next task and hasn't started.

**Housekeeping**

11. `README.md` still starts with `# ...existing content...` from the old site and should be rewritten.
12. `review/` is about 111 MB of screenshots and is untracked. Add `/review/` to `.gitignore` if you don't want it in git; this report is the only file from it that's committed.
13. `public/lab/slab-100-beyin.png` stays untracked and unused, as you decided.

## 4. Going live, step by step

The "Under construction" screen exists **only on `main`**, in two commits that aren't on the redesign branch: `fa872b3` and `351f58f`, which put `components/under-construction-splash.tsx` into `main`'s `app/layout.tsx`. The redesign deletes that root layout, because each skin has its own. **The merge removes the screen**, provided the one conflict is resolved as below. A dry run (`git merge-tree`) shows that is the only conflict.

1. **Final local check:**
   ```sh
   git switch redesign-2026
   npm ci && npm run build && npx next start -p 3100   # click through all 4 skins, then stop it
   ```
2. **Preview on Vercel** (recommended):
   ```sh
   git push -u origin redesign-2026
   ```
   Vercel builds a Preview deployment for the branch. Open its URL and use the style menu to check each skin on a phone and on desktop.
3. **Vercel → Settings → Environment Variables** (Production and Preview):
   - `NEXT_PUBLIC_SITE_URL=https://www.duruduygu.com` for canonical URLs, the sitemap and the feed.
   - `CONTENT_SOURCE=mock` for now. Switch to `directus` in section 5.
   - `REVALIDATE_SECRET=<long random string>`. Generate it with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
   - `SPOTIFY_*` only feeds `/api/spotify/now-playing`, which the new UI doesn't call yet (open item 7).
   - `NOTION_*` is needed only while the legacy routes exist (open item 4).
   - The new code doesn't use Vercel Analytics or Speed Insights. Turn them off in the dashboard if they're on.
4. **Merge into `main`:**
   ```sh
   git switch main
   git pull --ff-only
   git merge --no-ff redesign-2026
   #   CONFLICT (modify/delete): app/layout.tsx deleted in redesign-2026 and modified in main
   git rm app/layout.tsx components/under-construction-splash.tsx   # removes the Under construction screen
   npm ci && npm run build                                          # must pass before committing
   git commit                                                       # completes the merge
   git push origin main
   ```
   Vercel then deploys `main` to Production.
5. **After the deploy, check:**
   - `/` gives a random skin on a first visit, and switching skins in the style menu sticks after a reload.
   - In each skin: `/gallery`, a photo, `/blog`, a post, `/lab`, a project, `/about`, and a made-up URL (the 404 page).
   - `/feed.xml`, `/sitemap.xml`, `/robots.txt`, `/portfolio` (→ `/gallery`).
   - The OG image (paste the URL into a social-card preview).
   - PageSpeed Insights on `/`.
6. **If something is wrong:** Vercel → Deployments → previous production deployment → *Instant Rollback*. Or `git revert -m 1 <merge commit>` and push.
7. **If the domain goes through Cloudflare's proxy:** don't cache HTML at Cloudflare. The skin depends on the `duru-skin` cookie, and a cached page would show one visitor's skin to everyone. Add a Cache Rule that bypasses cache for everything except `/_next/static/*` and images.

## 5. Directus: what to create

Full field notes are in `SCHEMA.md`. Every collection except the two singletons gets `status` (dropdown `published` / `draft`, default `draft`); the site only shows `published`.

| Collection | Fields |
|---|---|
| `photos` | `status`, `sort` (manual sort on), `slug` (unique, optional), `image` (file, required), `title`, `alt`, `place`, `date`, `camera`, `note` (text), `width`, `height` (optional overrides) |
| `mood` | `status`, `sort`, `image`, `title`, `source`, `width`, `height` |
| `posts` | `status`, `slug` (unique, required), `kind` (`essay` / `video` / `note`), `title`, `excerpt`, `date`, `place`, `tags` (tags), `read_time`, `standfirst`, `content` (Markdown), `margin_note`, `cover_image`, `cover_caption`, `video_host` (`YouTube` / `Vimeo` / `File`), `video_url`, `video_duration` (`mm:ss`), `video_poster`, `chapters` (Repeater: `time`, `title`) |
| `projects` | `status`, `sort`, `slug`, `name`, `kind`, `one_liner`, `stage`, `year`, `tools`, `image`, `image_caption`, `drawing`, `drawing_caption`, `placeholder_ratio` (e.g. `4:5`), `stages` (Repeater: `label`, `state` = `done` / `now` / `next`), `about` (Markdown), `photos` (Files, M2M), `log` (O2M → `project_log.project`) |
| `project_log` | `project` (M2O → `projects`), `date`, `title`, `text` |
| `settings` (singleton) | `home_photo_quiet`, `home_photo_modern`, `home_photo_soft`, `home_photo_original` (each M2O → `photos`), `email` |
| `about` (singleton) | `portrait` (file), `summary`, `body` (Markdown), `currently`, `location`, `study`, `milestones` (Repeater: `year`, `title`, `text`; newest first), `shooting`, `listening` |

**Permissions:**
- The reading role (static token or Public) needs read on all of the above plus `projects_files`, with a `status = published` filter on `photos`, `mood`, `posts` and `projects`.
- **Public** needs read on `directus_files`, because browsers load images straight from `/assets/<id>`.
- Under Settings → Files & Storage, set "Allowed transformations" to **All**, or add presets for `format=webp` at widths 256–3840.

**Switching:**
1. Set `CONTENT_SOURCE=directus`, `DIRECTUS_URL`, `DIRECTUS_ASSETS_URL` (the public URL, e.g. `https://cms.duruduygu.com`), the optional `DIRECTUS_STATIC_TOKEN` (read-only) and `REVALIDATE_SECRET` in Vercel.
2. Redeploy.
3. Add a Directus Flow: an event hook on create / update / delete for these collections, which sends `POST https://www.duruduygu.com/api/revalidate?secret=<REVALIDATE_SECRET>&tag=content`. Without the Flow, pages refresh every 5 minutes.
4. To go back, set `CONTENT_SOURCE=mock`.
