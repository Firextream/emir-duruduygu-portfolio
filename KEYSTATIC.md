# Editing content with Keystatic

The site's content lives in this repo:

- `content/` holds the text, as YAML and Markdown files.
- `public/content/` holds the images.

Keystatic is the editor for those files, at `/keystatic`. The schema (what each form contains) is `keystatic.config.ts`; the site reads the same files through `lib/content/files`.

| Where | Keystatic saves to | Who can open `/keystatic` |
|---|---|---|
| `npm run dev` on your machine | the files on disk (local mode); commit them yourself | anyone who can reach your dev server |
| www.duruduygu.com (production) | GitHub: every **Save** is a commit to `main`, which redeploys the site (about 1–2 minutes) | only after **Sign in with GitHub**; with `KEYSTATIC_ALLOWED_GITHUB_USERS` set, only those accounts |

`/keystatic` is never indexed. It sends `noindex` (meta tag and `X-Robots-Tag` header), and `robots.txt` disallows it.

## Writing

- **Photos** are shown at their own ratio and never cropped. Fill in title, place, date and camera.
  - **File name** is what Quiet prints in its captions. Keystatic stores every upload as `image.<ext>`, so type the camera's file name here (e.g. `IMG_3849.jpg`).
  - **Order** is optional. Without it, the newest date comes first.
- **Journal** posts have a **Kind**: essay, note or video.
  - Video posts get their own fields: host, URL, duration, poster and chapters. Each chapter title should match a `## heading` in the text.
  - In the text, two images in one paragraph make a pair.
  - To use a gallery photo, put `![Caption](photo:<address>)` on its own line. The editor shows it as plain text, which is expected; the site renders it.
- **Lab projects** have the stages, more photos and the design log. **Order** is their position on the Lab page.
- **About**, **Milestones** and **Site settings** (home photo per skin, email) are single pages.
- **Placeholders** are written in `[brackets]`. Run `npm run placeholders` to list every one that's left, with file and line.

Before committing work done locally:

```sh
npm run images          # ≤ 2560 px, quality 82, no GPS, upright
npm run check:content   # every entry reads, every image and reference exists
```

Images uploaded on the live site go to GitHub as they are. Pull, run `npm run images`, then commit.

## Setting up GitHub mode (once)

Keystatic needs a GitHub App to sign you in and commit for you. It isn't created yet. These steps are all done by you, in your browser.

1. **Create the app.** GitHub → your avatar → **Settings** → **Developer settings** → **GitHub Apps** → **New GitHub App**.
   - **GitHub App name:** something unique, e.g. `duruduygu-keystatic`. The *slug* is this name in lowercase with dashes; it appears in the app's URL `github.com/apps/<slug>`.
   - **Homepage URL:** `https://www.duruduygu.com`
   - **Callback URL:** `https://www.duruduygu.com/api/keystatic/github/oauth/callback`
     - Optional second one, to try GitHub mode locally: `http://127.0.0.1:3000/api/keystatic/github/oauth/callback`
     - Preview deployments have changing URLs, so sign-in only works on the URLs listed here.
   - **Expire user authorization tokens:** leave it **checked**. Keystatic refreshes the token with it.
   - **Request user authorization (OAuth) during installation:** check it.
   - **Webhook:** uncheck **Active**.
   - **Repository permissions:**
     - **Contents:** Read and write
     - **Metadata:** Read-only (set automatically)
     - **Pull requests:** Read-only
     - Nothing else.
   - **Where can this GitHub App be installed?** **Only on this account.**
   - Click **Create GitHub App**.
2. **Copy the credentials** from the app's page:
   - the **Client ID**;
   - a client secret: **Generate a new client secret**, then copy it right away (GitHub shows it once).
3. **Install the app on the repo.** On the app page, click **Install App** next to your account (`Firextream`). Choose **Only select repositories**, then **emir-duruduygu-portfolio**, then **Install**.
4. **Make a session secret** (any long random string):
   ```sh
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. **Vercel** → the project → **Settings** → **Environment Variables**, for **Production**:

   | Name | Value |
   |---|---|
   | `KEYSTATIC_GITHUB_CLIENT_ID` | the Client ID (step 2) |
   | `KEYSTATIC_GITHUB_CLIENT_SECRET` | the client secret (step 2), marked **Sensitive** |
   | `KEYSTATIC_SECRET` | the string from step 4, marked **Sensitive** |
   | `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | the app's slug (step 1) |
   | `KEYSTATIC_ALLOWED_GITHUB_USERS` | `Firextream` (comma-separate more accounts if you add editors) |

   Leave `NEXT_PUBLIC_KEYSTATIC_STORAGE` **unset** on Vercel; `local` only works on your own machine. The repo defaults to `Firextream/emir-duruduygu-portfolio`; set `NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO` only if it moves.
6. **Redeploy** (Deployments → the latest one → **Redeploy**), so the `NEXT_PUBLIC_` values are built in.
7. **Open `https://www.duruduygu.com/keystatic`.** You're sent to GitHub. Authorize the app, and you land in the editor.

**Until step 5 is done**, `/keystatic` on the live site redirects to the sign-in route, which answers *“Keystatic isn't set up on this deployment yet”* (503). The rest of the site is unaffected.

### How access is protected

- **No GitHub sign-in, no editor.** The middleware (`lib/keystatic-gate.ts`) only lets requests in that carry Keystatic's GitHub token cookie; otherwise it redirects to GitHub sign-in.
- **The allow-list.** With `KEYSTATIC_ALLOWED_GITHUB_USERS` set, the token must also belong to one of those GitHub accounts. This is checked against `api.github.com/user` and cached for 10 minutes. Anyone else gets a 403.
- **GitHub's own permissions.** A save is a commit made with *your* GitHub permissions. An account without write access to the repo can't change anything, even if it got past the steps above.

To stop all editing at once, delete the client secret on the GitHub App page, or uninstall the app.

### Editing on a branch instead of `main` (optional)

Every save currently goes live after a redeploy. To review changes first, open `/keystatic`, create a branch from the branch picker and edit there. Vercel builds a preview for that branch, and you merge it on GitHub when it's ready.

## Local mode

- `npm run dev`, then open `http://localhost:3000/keystatic`. Saves write to `content/` and `public/content/`; commit them as usual.
- In local mode `/keystatic` has no login. The dev server listens on your local network, so only run it on networks you trust.
- To try the editor on a production build on this machine: `NEXT_PUBLIC_KEYSTATIC_STORAGE=local npm run build && npx next start`. Never set this on Vercel.
