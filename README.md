# Dr. Akif Rahim — Portfolio Website

A modern, multi-page portfolio website for **Dr. Akif Rahim (PhD)** — Hydro-Climatologist, Flood & Drought Modeler, and Water–Energy–Food–Environment (WEFE) Nexus specialist.

## 🎨 Theme

**"Midnight Navy & Cyan"** — deep navy backgrounds (`#060f1f → #12294d`) with electric blue (`#2563eb`) and cyan (`#06b6d4 → #22d3ee`) accents on a cool off-white base. Modern, professional, and a natural fit for water and climate science.

- **Headings:** Sora (Google Fonts)
- **Body:** Inter (Google Fonts)
- **Icons:** Inline SVG (no external icon libraries)

## 📄 Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, stats counters, partner marquee, specializations, featured projects, selected publications |
| `about.html` | Profile summary, specialization details, academic timeline, awards & honors |
| `experience.html` | Current position (IWMI), full career timeline (2009–present), skills, trainings |
| `projects.html` | Operational systems (PakDMS, WBIP), research & consulting projects |
| `publications.html` | Journal articles + conference presentations, Google Scholar link |
| `contact.html` | Contact details + message form (opens email client) |

## 🚀 How to Use

**Locally:** just double-click `index.html` — no build step, no server needed.

**Deploy (free options):**
- **GitHub Pages** — push the folder to a repo, enable Pages in settings
- **Netlify** — drag & drop the folder at app.netlify.com
- **Vercel** — import the folder at vercel.com

## 🗂 Structure

```
Portfolio/
├── index.html            # Home
├── about.html            # About
├── experience.html       # Experience
├── projects.html         # Projects
├── publications.html     # Publications
├── contact.html          # Contact
├── assets/
│   ├── css/style.css     # Shared stylesheet (theme)
│   ├── img/
│   │   └── akif-rahim.png  # Portrait photo (hero, About, home profile card)
│   └── js/main.js        # Nav, counters, reveal animations, form
├── CV_Akif_Rahim.pdf     # Source CV
└── README.md
```

## ✏️ Customization Tips

- **Colors** — edit the CSS variables at the top of `assets/css/style.css`
- **Google Scholar link** — search "Google Scholar + Akif Rahim", copy your profile URL, and replace `https://scholar.google.com` in the pages
- **Photo** — the portrait appears in three places (`index.html` hero + profile card, `about.html`). To change it, replace `assets/img/akif-rahim.png` keeping the same filename — a square image of **600×600 px or larger** works best.
- **Stats** — the counters use `data-count` attributes in `index.html`
- **Hero rotating word** — edit the `data-rotator` attribute on the `.rotator` span in `index.html` (pipe-separated list)
- **Hero portrait** — the framed photo in the hero uses `.hero-photo` (gradient border) and `.hero-photo-badge` in `assets/css/style.css`; resize it with the `.hero-photo-wrap { width }` value
- **Hero background** — `.hero-blob-1/2` control the glow colours; the wave shape lives in the `.hero-wave` SVG path in `index.html`

### Sliders

The specialization, project, and award sections are sliders instead of grids:

```html
<div class="slider" data-slider>
  <div class="slider-viewport" data-slider-viewport>
    <div class="card slider-card">…</div>   <!-- repeat per card -->
  </div>
  <div class="slider-controls">
    <button class="slider-btn" data-slider-prev>…</button>
    <div class="slider-dots" data-slider-dots></div>
    <button class="slider-btn" data-slider-next>…</button>
  </div>
</div>
```

- Cards per view are set by `.slider-card { flex-basis }` — 3 on desktop, 2 on tablet, 1.2 on mobile
- Navigation is automatic: arrows, dots, mouse drag, touch swipe, and arrow keys all work
- To go back to a plain grid, swap the wrapper for `<div class="grid-3">` and remove the `slider-card` class from the cards (plus the `.slider-controls` block)

## ✨ Features

- Fully responsive (mobile hamburger menu)
- **Sliders** for specialization, project, and award cards — arrows, dots, drag, swipe, keyboard
- **Animated hero**: rotating specialty word, framed portrait with specialization badge, ambient glow blobs, mouse parallax, wave divider
- Scroll-reveal animations & animated stat counters
- Infinite partner-logo marquee (pauses on hover)
- Sticky blurred header with active-page highlighting
- Contact form that composes an email via the visitor's mail client
- SEO meta descriptions + custom favicon on every page
- Respects `prefers-reduced-motion`
- No frameworks, no build tools — pure HTML/CSS/JS, loads fast
