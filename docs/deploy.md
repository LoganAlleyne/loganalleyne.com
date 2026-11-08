# Deploying loganalleyne.com

## Where things stand

- The live site is the old static site from the `LoganAlleyne/Portfolio-Redux` repository, served by Netlify. (The response headers say `server: Netlify`, the DNS is on Netlify's NS1 nameservers, and `www` 301-redirects to the bare domain.)
- This repository is local only: it is not yet on GitHub, and Netlify does not know about it.
- All six case studies are drafts. They do not appear in the production build until their `draft` flag is set to `false`.

## The plan

The goal is to swap what the existing Netlify site builds from, without touching the domain or DNS. Rolling back is then one click.

### 1. Push the repository to GitHub

```bash
cd ~/Documents/GitHub/loganalleyne.com
gh repo create LoganAlleyne/loganalleyne.com --public --source . --push
```

Check that the CI workflow passes on `main` (type check plus the Playwright suite).

### 2. Preview on a throwaway Netlify site first

In the Netlify UI: **Add new site → Import an existing project → GitHub → LoganAlleyne/loganalleyne.com**. Netlify reads `netlify.toml`, so the build command (`npm run build`), publish directory (`dist`) and Node version (22) are already set.

This gives a `*.netlify.app` URL. Check it on a phone and a desktop:

- the home page in both themes
- the CV download
- a made-up URL, to see the 404 page
- the response headers (`curl -sI https://<preview>.netlify.app`), which should include the Content-Security-Policy

### 3. Move the domain across

There are two ways to do this; the first is simpler.

**A. Move the domain to the new site (recommended).**
1. On the old site (the one built from Portfolio-Redux): **Domain management → remove `loganalleyne.com` and `www.loganalleyne.com`**.
2. On the new site: **Domain management → Add a domain → `loganalleyne.com`**. Because the DNS zone is already on Netlify, it attaches straight away, and Netlify issues the HTTPS certificate within minutes.
3. Make `loganalleyne.com` the primary domain, so `www` keeps redirecting to it.

The site is down only for the minute or two between the two steps.

**B. Repoint the old site.** On the old site: **Site configuration → Build & deploy → Link repository** to `LoganAlleyne/loganalleyne.com`, then set the build command to `npm run build` and the publish directory to `dist`. This keeps the old site's settings and deploy history in one place, but mixes the old and new histories together.

### 4. Check it's live

```bash
curl -sI https://loganalleyne.com | grep -i -E "server|content-security"
curl -sI https://loganalleyne.com/logan-alleyne-cv.pdf | head -1
```

Then run the page through PageSpeed Insights (the target is 95 or more in every category) and the LinkedIn Post Inspector to refresh the cached preview image.

## Rolling back

- **Option A:** move the domain back to the old site (the reverse of step 3). The old site stays deployed and untouched until you delete it.
- **Option B:** use **Deploys → pick the last Portfolio-Redux deploy → Publish deploy**.

Keep the old site for a couple of weeks before deleting it.

## Publishing a case study

1. Confirm with Aspen Pumps that it's fine to publish.
2. Set `draft: false` in that file's front matter, in `src/content/work/`.
3. Update `tests/build.spec.ts` if no drafts are left. Its first test expects at least one draft, so replace it with a test that asserts the published pages exist.
4. Push. Netlify rebuilds on every push to `main`.

## Day to day

- **Update the CV:** change `cv-master.md` first. Then update `src/content/profile.ts` and `scripts/cv/cv.html`, and run `npm run cv:pdf`.
- **Social image:** `npm run og:image` after editing `scripts/og/og.html`.
- **Netlify CLI:** the copy installed globally on this machine crashes under Node 25. The deploy plan above uses only the web interface and doesn't need it.
