# Profile kit — setup

## 1. Put the files in your profile repo

Your profile repo is `github.com/Nawazaz/Nawazaz` (the one named exactly like your username).
Copy these into the **root** of that repo:

```
README.md
assets/                      <- all 23 SVGs
scripts/gh-stats.mjs         <- renders your GitHub stats, see step 3
.github/workflows/stats.yml  <- runs it daily
.github/workflows/snake.yml  <- optional, see step 4
```

Commit and push to `main`. That's it — the profile updates immediately.

## 2. Check the project links

Two mission cards link to repos. Confirm these are right:

| Card | Links to |
|---|---|
| Mission 02 — Desktop AI Companion | `github.com/Nawazaz/Desktop-Companion` |
| Mission 04 — Plant Monitoring System | `github.com/Nawazaz/Plant-monitoring-system` |

Missions 01 and 03 aren't linked (the SRE agent is a private team repo, and I didn't find a
public repo for the crypto DSS). If either has a public repo, wrap its `<img>` in a link the
same way the others are wrapped in `README.md`.

## 3. The GitHub stats panels

`assets/gh-stats.svg` and `assets/gh-langs.svg` are generated from the GitHub API by
`scripts/gh-stats.mjs`, and the `stats.yml` workflow re-renders them every night.

**Why not the usual cards?** The popular `github-readme-stats.vercel.app` and
`github-profile-trophy.vercel.app` images are a single shared public instance used by millions
of profiles, so they get rate-limited and go down often — that's why they were showing as
broken images for you. These panels talk to the API with your repo's own built-in token, so
there's no shared quota to run out of, and they match the rest of the design.

To get them going:

1. Push `scripts/`, `.github/workflows/stats.yml` and the two SVGs.
2. Repo **Settings → Actions → General → Workflow permissions** → set **Read and write
   permissions**, and save. The workflow commits the refreshed SVGs back, so it needs this.
3. **Actions** tab → **Refresh GitHub stats** → **Run workflow**.

The two SVGs in the zip are rendered from **sample numbers** so you can see the layout. The
first workflow run replaces them with your real ones.

To preview locally: `node scripts/gh-stats.mjs --mock`

A caveat on the numbers: `COMMITS` is your last 12 months, not all time, because that's what
the API returns in one query — the label says so. Stars, repos and languages cover your public
non-fork repos, up to the first 100.

## 4. The contribution snake (optional but it's the best moving bit)

`.github/workflows/snake.yml` regenerates the snake that eats your commit graph, twice a day.

1. Push the workflow file.
2. Go to **Actions** on the repo and enable workflows if prompted.
3. Open **Generate contribution snake** → **Run workflow** to kick off the first run.

It pushes `snake.svg` and `snake-dark.svg` to an `output` branch, which the README points at.
Until that first run completes, the snake image in the README will be broken — that's expected.

If the snake run fails, check the action's own README at `github.com/Platane/snk` — I used
`Platane/snk@v3` plus `crazy-max/ghaction-github-pages@v4` to push the result, which is the
common pairing, but action versions do move.

## 4. Editing later

Everything is plain SVG — open any file in `assets/` and the text is right there in readable
XML. Common edits:

- **Change a number or label:** search for the text, change it.
- **Chip widths:** each chip's `<rect width>` is sized for its label. If you make a label
  longer, widen the rect and re-centre the `<text x>` at `rect.x + width/2`.
- **Colours:** every file uses the same four — `#22e8ff` (cyan), `#8b5cff` (violet),
  `#3ddc84` (green), `#ff4d9d` (pink), on `#070a0f` / `#0b0f14` backgrounds.

## Notes on what I left out

- **Your phone number** is on your CV but not in the README. A GitHub profile is a public page
  that gets scraped; your LinkedIn is the better contact route and it's linked.
- **Fonts:** GitHub doesn't load webfonts inside images, so everything uses the system
  monospace stack. It looks right on every platform, but it isn't literally JetBrains Mono.
- **Animation:** all motion is either a continuous loop or decorative. Every piece of real
  information — names, dates, numbers, skills — is drawn statically, so nothing can get stuck
  mid-animation and show the wrong thing partway down a long page.
- **Reduced motion:** every file respects `prefers-reduced-motion`, so the animations stop for
  visitors who've asked their OS for that.
