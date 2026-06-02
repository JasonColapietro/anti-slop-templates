# Anti-Slop Templates

Two committed design systems, four surfaces each, built to be the **opposite of generic AI output**.

The "AI slop" look isn't one bad choice — it's the *absence* of choices: purple-to-blue gradients, a centered headline over a blurred blob, three identical feature cards, Inter on white, emoji bullets, uniform radii and shadows everywhere. The cure isn't "good taste" in the abstract. It's **picking one specific, opinionated direction and building everything in it.** This repo is two such commitments.

| System | Feel | Type | Palette | Surfaces |
|---|---|---|---|---|
| **Editorial** (`/editorial`) | Warm, print-rooted, Swiss-modern. Brand: *Folio*, a writing tool. | Fraunces + Hanken Grotesk | Warm paper · near-black ink · one **persimmon** accent | landing · article · pricing · dashboard |
| **Suede** (`/suede`) | Dark "institutional IP terminal" — matches **suedeai.ai**. | Instrument Serif + Manrope + JetBrains Mono | Deep ink · **Rights Red** · **Registry Cyan** · brass · signal green | landing · docs · pricing · dashboard |

## Quick start

No build step. Either:

```bash
# Option A — open the gallery directly
open index.html            # macOS

# Option B — serve the folder (nicer for relative paths)
python3 -m http.server 8099
# then visit http://localhost:8099/
```

Start at **`index.html`** — the master gallery that previews both systems and links every page.

## What's in the box

```
anti-slop-templates/
├─ index.html / index.css        Master gallery (specimen sheet of both systems)
├─ shared/
│  └─ reveal.js                  Dependency-free: scroll reveal, count-up, header condense
│                                (honors prefers-reduced-motion)
├─ editorial/
│  ├─ index.html                 Set contents
│  ├─ landing.html               Asymmetric hero · layered manuscript · bento · dark band
│  ├─ article.html               Drop cap · marginalia grid · measure-breaking pull quote
│  ├─ pricing.html               Asymmetric plans · comparison table set as typography
│  ├─ dashboard.html             "The Desk" — hand-built bar chart, drafts, focus card
│  └─ styles/
│     ├─ tokens.css              ← the design system (edit this to reskin all 4 pages)
│     └─ landing/article/pricing/dashboard/index.css
└─ suede/
   ├─ index.html                 Set contents
   ├─ landing.html               Proof-record hero · registry stats · bento · cream creed
   ├─ article.html               Terminal docs · sticky TOC · colored code blocks
   ├─ pricing.html               Registry plans · metered readout · comparison matrix
   ├─ dashboard.html             "Registry Terminal" — SVG area chart, ledger, identity
   └─ styles/
      ├─ tokens.css              ← the design system
      └─ landing/article/pricing/dashboard/index.css
```

## Customizing

**Reskin everything by editing one file.** Each system's entire look lives in its
`styles/tokens.css` as CSS custom properties — colors (in `oklch`), a fluid type
scale, spacing, radii, elevation and motion. Change the accent or the type families
there and all four surfaces follow. Per-surface CSS only handles that surface's layout.

```css
/* editorial/styles/tokens.css */
--accent: oklch(0.585 0.180 33);   /* swap the persimmon for any single accent */
--font-display: 'Fraunces', serif; /* swap the display face */
```

## Porting to your stack

The markup maps 1:1 onto Tailwind utilities or JSX components — the CSS-variable
scale is the contract. Drop the `:root` tokens into your `@theme`/`:root`, translate
the primitive classes (`.btn`, `.eyebrow`, `.badge`, `.panel`, `.registry-rule`,
`[data-reveal]`) into components, and the look comes with them. Ask and any single
page can be delivered as a Tailwind `.tsx` component.

## Built-in qualities

- **Anti-slop by construction** — scale contrast, asymmetric rhythm, layered depth,
  type with character, semantic color, designed hover/focus/active, grid-breaking
  composition, paper grain / terminal gridlines, data-viz treated as part of the system.
- **Accessible** — semantic landmarks, real heading order, `:focus-visible` rings,
  skip links, `aria` labels on charts/nav, `prefers-reduced-motion` fully respected.
- **Performant** — compositor-only motion (`transform`/`opacity`), `font-display: swap`,
  no JS framework, ~3KB of vanilla JS shared across every page.
- **Responsive** — tested at 1440 / 1280 / 768 / 375; grids collapse, nav condenses,
  charts and tables reflow.

Fonts load from Google Fonts (online); offline, each system falls back to Georgia /
system-ui gracefully.
