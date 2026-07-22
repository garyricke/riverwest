# River West Family Fitness — Website

Single-file static site for [River West Family Fitness](https://riverwestfamilyfitness.com), Batavia, IL.
No build step. Plain HTML/CSS/JS. All photos served from Cloudinary with `f_auto,q_auto`.

## Files

| File | Purpose |
|---|---|
| `index.html` | Main marketing site |
| `college-break.html` | Landing page — College Student Break Pass ($229/year) |
| `college-break-popup.html` | Modal/popup demo that links to the landing page |
| `college-break-email.html` | HTML email blast (table-based, dark-mode aware) |
| `college-break-flyer.html` | Print-ready 8.5×11 flyer for the front desk |
| `logos/` | SVG wordmarks + icon |

## Conventions

- **Design tokens** (CSS custom properties): `--iron #1A1A1B`, `--gold #C5A059`, `--slate #E5E5E5`
- **Fonts**: Bebas Neue (display), Montserrat (headings), Inter (body) — via Google Fonts
- **Layout**: CSS Grid + `clamp()` for fluid sizing
- **Full-bleed sections**: element must be a direct child of `<section>`, not inside `.container`
- **Accordions**: native `<details>/<summary>` (no JS)

## Image delivery

All photos live on Cloudinary under `dsbllwpbh`:

- `riverwest/web/*` — main site heroes
- `riverwest/testimonials/*` — member testimonial backgrounds
- `riverwest/student-promo/*` — College Break Pass assets

URLs always include `f_auto,q_auto` so each browser gets WebP/AVIF at the right size.

## Local development

Open `index.html` directly in a browser — no build, no server. Live changes show on refresh.

## Address

108 First Street, Batavia, IL 60510 · 630.879.8889
