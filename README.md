# QuikShot website

A static, three-page marketing site for QuikShot. Designed to publish on GitHub Pages.

## Pages

- `index.html` — Home: hero, features, lanes, FAQ, privacy block.
- `release-notes.html` — Versioned release log with on-deck roadmap.
- `privacy.html` — Privacy policy + medical disclaimer.

## Publish to GitHub Pages

1. Push the site files to the `quikshot` repo root.
2. In the repo, **Settings → Pages**.
3. Source: **Deploy from a branch**. Branch: `main`, folder: `/`.
4. Save. The site will publish at `https://<user>.github.io/<repo>/`.

A `.nojekyll` file is included so GitHub Pages serves the files as-is without running Jekyll.

## Files

```
quikshot/
├── index.html
├── release-notes.html
├── privacy.html
├── .nojekyll
├── styles/
│   ├── tokens.css       ← QuikShot design tokens (colors, type, spacing)
│   └── site.css         ← Shared site layout
└── assets/
    ├── logo.svg
    ├── wordmark.svg
    ├── app-icon.svg
    └── lane-*.svg
```

## Editing

- All design tokens live in `styles/tokens.css` (mineral, paper, ink, lane colors, type scale).
- Each page has its own `<style>` block for page-specific layout, on top of the shared `site.css`.
- Voice rules apply: sentence case, numerals for doses/times, no emoji.
