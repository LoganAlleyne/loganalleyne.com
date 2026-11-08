# loganalleyne.com

Personal site for Logan Alleyne, a full-stack software engineer. Built as a static Astro site with Tailwind CSS, hosted on Netlify.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321, with draft case studies visible
npm run build      # production build in dist/, drafts excluded
npm run preview    # serve the production build
```

## Test it

```bash
npx playwright install chromium   # first time only
npm test                           # builds, then tests the production and dev servers
npm run check                      # Astro and TypeScript checks
```

## Where things live

| Path | What it holds |
|---|---|
| `src/content/profile.ts` | Profile, facts, experience, skills and contact details, taken from the master CV |
| `src/content/work/*.md` | Case studies. `draft: true` keeps one out of production |
| `src/components/` | Page sections (Hero, Experience, WorkCards, Skills, Contact) |
| `src/styles/global.css` | Theme tokens for dark (the default) and light |
| `scripts/cv/` | The generic CV and its PDF build (`npm run cv:pdf`) |
| `scripts/og/` | The social preview image (`npm run og:image`) |
| `public/_headers` | Security and cache headers for Netlify |
| `docs/deploy.md` | How to deploy, switch the domain over and roll back |

## Content rules

- Every fact comes from the master CV, or from the engineering playbook for the case studies.
- Use British English.
- FrameTech is always one word, with a capital F and T.
