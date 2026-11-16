# Profile kit — setup

## 1. Put the files in your profile repo

Your profile repo is `github.com/Nawazaz/Nawazaz` (the one named exactly like your username).
Copy these into the **root** of that repo:

```
README.md
assets/                      <- all 21 SVGs
.github/workflows/snake.yml  <- optional, see step 3
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

## 3. The contribution snake (optional but it's the best moving bit)

`.github/workflows/snake.yml` regenerates the snake that eats your commit graph, twice a day.

1. Push the workflow file.
2. Go to **Actions** on the repo and enable workflows if prompted.
3. Open **Generate contribution snake** → **Run workflow** to kick off the first run.

It pushes `snake.svg` and `snake-dark.svg` to an `output` branch, which the README points at.
Until that first run completes, the snake image in the README will be broken — that's expected.

If the run fails, check the action's own README at `github.com/Platane/snk` — I used
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
