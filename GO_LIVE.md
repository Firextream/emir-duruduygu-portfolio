# Going live

The site goes live on **Vercel**. Content comes from files in this repo (`content/` + `public/content/`), edited with **Keystatic** (KEYSTATIC.md). The forms send through **Resend**. There's no CMS server to run. Directus stays available as an optional source (`CONTENT_SOURCE=directus`, SCHEMA.md).

Everything below is for you to do. Nothing has been merged, pushed or deployed.

## 0. Before you start

On `redesign-2026`, all of this passes with a production build:

```sh
npm ci
npm test                 # Markdown parser tests
npm run check:content    # every entry reads, every image and reference exists
npm run build            # CONTENT_SOURCE defaults to files
npx next start -p 3100   # click through the four skins, then stop it
```

`npm run placeholders` lists the `[bracketed]` placeholder copy that's still in `content/`. Fill it in with Keystatic before or after launch; until then the site shows it as is.

## 1. Vercel project settings

Project → **Settings**:

- **Build & Development:** Framework **Next.js**, Root Directory `.`, defaults for Build (`npm run build`), Install and Output. No `vercel.json` is needed.
- **Node.js Version:** 22.x. `package.json` pins `"engines": { "node": "22.x" }`.
- **Git → Production Branch:** `main`.
- **Analytics / Speed Insights:** the new code doesn't include them; turn them off if they're on.

## 2. Environment variables

Project → Settings → **Environment Variables**. Mark secrets **Sensitive**.

| Name | Production | Preview | Value |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | ✓ | — | `https://www.duruduygu.com` |
| `CONTENT_SOURCE` | optional | optional | `files` (the default) |
| `RESEND_API_KEY` | ✓ | — | Resend → API Keys → **Full access**. The newsletter creates contacts, which a *Sending access* key can't |
| `RESEND_SEGMENT_ID` | ✓ | — | the id of the newsletter segment in Resend (section 5) |
| `RESEND_FROM` | optional | — | default `duruduygu.com <emir@duruduygu.com>` |
| `CONTACT_TO` | optional | — | default `emir@duruduygu.com` |
| `KEYSTATIC_GITHUB_CLIENT_ID` | ✓ | — | GitHub App (KEYSTATIC.md) |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | ✓ | — | GitHub App, Sensitive |
| `KEYSTATIC_SECRET` | ✓ | — | random, Sensitive |
| `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | ✓ | — | GitHub App slug |
| `KEYSTATIC_ALLOWED_GITHUB_USERS` | ✓ | — | `Firextream` |

**Don't set on Vercel:** `NEXT_PUBLIC_KEYSTATIC_STORAGE` (local editing only), `CONTENT_EMPTY` / `MOCK_EMPTY` (review only), `DIRECTUS_*` and `REVALIDATE_SECRET` (Directus only).

**Old variables:**
- `NOTION_*` and `CLOUDINARY_*` belonged to the old site; delete them after the merge (section 9). Keep `SPOTIFY_*`.
- `RESEND_AUDIENCE_ID` still works as the segment id if you'd rather keep it.

Without `RESEND_API_KEY` both forms answer **503** with a clear message. Without the Keystatic variables, `/keystatic` answers 503. The site builds and runs either way.

## 3. Merge `redesign-2026` into `main`

The "Under construction" screen exists only on `main`, in two commits (`fa872b3`, `351f58f`) that render `components/under-construction-splash.tsx` from `main`'s `app/layout.tsx`. The redesign deletes that root layout (each skin has its own), so the merge removes the screen. A dry run (`git merge-tree`) shows exactly one conflict, and it's that file.

```sh
git switch main
git pull --ff-only
git merge --no-ff redesign-2026
#   CONFLICT (modify/delete): app/layout.tsx deleted in redesign-2026 and modified in main
git rm app/layout.tsx components/under-construction-splash.tsx   # this removes the Under construction screen
npm ci && npm test && npm run build                              # must pass before you commit
git commit                                                       # completes the merge
git push origin main                                             # Vercel deploys main to production
```

Want a look first? `git push -u origin redesign-2026` gets you a Vercel Preview deployment to click through. Keystatic sign-in won't work on preview URLs, because GitHub only accepts the callback URLs registered on the app.

## 4. Domain

If `duruduygu.com` already serves the Under construction page from this Vercel project, the domain is set up; the merge deploys over it. To check, open Project → Settings → **Domains**. Both of these should say *Valid Configuration*:
- `www.duruduygu.com`, the primary domain;
- `duruduygu.com`, redirecting to `www`.

If they're missing:
1. Add both domains in Vercel.
2. In **Cloudflare → DNS**, add the records Vercel shows. Usually that's `A @ 76.76.21.21` and `CNAME www cname.vercel-dns.com`, but use Vercel's values.
3. Set both to **DNS only** (grey cloud).

**If you ever turn Cloudflare's proxy on**, don't let Cloudflare cache HTML. The skin depends on the `duru-skin` cookie, and a cached page would show one visitor's skin to everyone. Cache only `/_next/static/*` and images.

## 5. Resend: verify the domain and the forms

1. **Resend → Domains → Add domain** `duruduygu.com`. Pick a region; Resend then shows the exact DNS values to copy.
2. **In Cloudflare → DNS**, add what Resend shows. Enter only the part before `duruduygu.com` as the name; Cloudflare appends the domain itself.

   | Type | Name | Content | Priority | Proxy |
   |---|---|---|---|---|
   | MX | `send` | the MX host Resend shows, e.g. `feedback-smtp.eu-west-1.amazonaws.com` (it depends on the region you chose) | 10 | DNS only |
   | TXT | `send` | `v=spf1 include:amazonses.com ~all` | — | DNS only |
   | TXT | `resend._domainkey` | the long `p=MIGf…` key Resend shows (unique to your domain) | — | DNS only |
   | TXT | `_dmarc` (recommended) | `v=DMARC1; p=none; rua=mailto:emir@duruduygu.com` | — | DNS only |

   - These live on the `send.` subdomain and `resend._domainkey`. They don't touch the MX records that deliver mail to `emir@duruduygu.com`.
   - If MX priority 10 is already used on `send`, use 20.
   - If you already have a `_dmarc` record, keep it and skip this one.
3. **Wait for "Verified"** in Resend (minutes to a few hours), then create the API key (section 2).
   - Right now Resend answers: *"The duruduygu.com domain is not verified"*. A test from this machine got exactly that reply, so no email went out.
4. **Make sure `emir@duruduygu.com` receives mail.** The contact form sends *to* it, with the visitor as Reply-To.
   - If it doesn't have an inbox yet, use **Cloudflare → Email → Email Routing**: add `emir@duruduygu.com` and forward it to your Gmail. Cloudflare adds its own MX/SPF records on the root domain, which don't conflict with Resend's.
   - Or set `CONTACT_TO` to another address.
5. **Newsletter.** Resend renamed *Audiences* to *Segments* in November 2025, and contacts are now global. Create a segment (e.g. "Newsletter") and put its id in `RESEND_SEGMENT_ID`. Signups are created as contacts in that segment, and an address that's already there is answered like a new signup.
6. **After deploying,** send yourself a message from the About page of any skin.

**Protection on both forms:**
- a hidden honeypot field (bots get a fake "ok" and nothing is sent);
- 5 tries per IP per 10 minutes, per server instance;
- plain-text email only;
- the same message within 24 hours is delivered once (Resend's `Idempotency-Key`).

## 6. Keystatic

Follow **KEYSTATIC.md → Setting up GitHub mode**: create the GitHub App, install it on the repo and set the five variables. After a redeploy, `https://www.duruduygu.com/keystatic` asks for GitHub sign-in, and each Save commits to `main` and redeploys.

## 7. After the deploy

- `/` gives a random skin on a first visit; switching skins in the style menu sticks after a reload.
- In each skin, check `/gallery`, a photo, `/blog`, a post, `/lab`, a project, `/about` and a made-up URL (the 404).
- Check `/feed.xml`, `/sitemap.xml` and `/robots.txt` (it disallows `/keystatic`). `/portfolio` should redirect to `/gallery`.
- Send the contact form and sign up for the newsletter. Check Resend → Emails and → Contacts.
- `/keystatic` should send you to GitHub, then open the editor. Make a small change, save it, and check it's live after the redeploy.
- Run PageSpeed Insights on `/`.

**If something's wrong:** Vercel → Deployments → the previous production deployment → **Instant Rollback**. Or `git revert -m 1 <merge commit>` and push.

## 8. Images, and when to move them to Cloudflare R2

Photos live in the repo (`public/content/<collection>/<address>/`). Before committing locally added photos, run `npm run images`:
- it resizes to ≤ 2560 px on the long edge at quality 82;
- it turns the pixels upright, drops EXIF (including GPS) and keeps the colour profile;
- it never recompresses a file twice.

Every image URL carries a content hash (`?v=…`), so replacing a photo is never hidden by a cache.

Git keeps every version of every photo forever, and every Vercel build clones the repo and uploads `public/`. Today that's 1.7 MB of content images, which is fine for a long time. **Plan the move to R2 when any of these happens:**

- **`public/content` passes about 300 MB**, roughly 300–400 photos at 2560 px. `npm run images` prints the total and warns at 300 MB.
- **The repo's history passes about 1 GB.** Check with `git count-objects -vH` (`size-pack`). GitHub recommends staying under 1 GB and blocks files over 100 MB.
- **Vercel → Usage → Image Optimization** gets close to your plan's monthly allowance, or builds and deploys get noticeably slower.

What the move involves:
- an R2 bucket with a public custom domain (e.g. `img.duruduygu.com`);
- photo entries that store the image URL plus width and height, since there's no local file to measure any more;
- that host added to `images.remotePatterns`;
- Keystatic's image field becoming a URL field, or a small upload step.

The site's types and skins don't change.

## 9. Old site cleanup (done 28 Oct 2026)

- The old API routes (`/api/image-proxy`, `/api/download`, `/api/test-notion`, `/api/gallery`, `/api/test-gallery`), `lib/notion.js`, the Notion/Cloudinary scripts and their packages, and the old site's stock images in `public/` are gone.
- **Spotify stays:** `/api/spotify/now-playing` feeds the Modernist home, so keep the `SPOTIFY_*` variables.
- After the merge is live, delete `NOTION_*` and `CLOUDINARY_*` on Vercel, and revoke the Notion integration token in Notion (Settings → Connections).
