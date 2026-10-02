# SEDS Aurora — Website v2

The official website of **SEDS Aurora**, the VIT-AP University chapter of *Students for the Exploration and Development of Space* (SEDS India).

Built with plain HTML, CSS and JavaScript, bundled by [Vite](https://vitejs.dev). The site has **no runtime dependencies**: the aurora hero is a hand-written WebGL shader, and everything else is vanilla JS.

## Features

| Section | What it does |
|---|---|
| **Hero** | Live WebGL aurora, star field and planet horizon that react to the mouse and to scrolling. Shows a mission-elapsed-time counter that started at the chapter launch (07 Dec 2019). |
| **Altimeter** | The scroll progress bar is a rocket climbing from 0 to 420 km, passing the Kármán line on the way to ISS orbit. It only shows on desktop. |
| **Divisions** | An interactive orbit system. Click a planet (Core, Projects or Outreach) to read about that division. |
| **Mission Log** | A timeline of events. Each event opens a "dossier" with a photo carousel and full details. There's also a card for the next upcoming event. |
| **Sky Live** | A real-time ISS tracker on a dot-matrix globe that shows the distance from VIT-AP. Below it, tonight's Moon phase (calculated in the browser) and rotating space facts. |
| **Crew** | Current and legacy team tabs, division filters and holographic tilt cards. |
| **Transmissions** | The archive of the monthly newsletter. |
| **Gallery** | A masonry gallery you can filter by event. The lightbox supports keyboard and swipe. |
| **Join** | A *hold-to-launch* button. Hold it down, the rocket launches, and an email draft opens. |
| 🥚 | Try the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A |

The site respects `prefers-reduced-motion`, works with a keyboard, and adapts to mobile.

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## Deploy on Vercel via GitHub

1. Create a new GitHub repository (for example, `seds-aurora-website`) and push this folder to it:
   ```bash
   git init
   git add .
   git commit -m "SEDS Aurora website v2"
   git branch -M main
   git remote add origin https://github.com/<your-org>/seds-aurora-website.git
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Vercel detects **Vite** automatically: the build command is `npm run build` and the output folder is `dist`. Click **Deploy**.
4. Every push to `main` redeploys the site automatically. Pull requests get preview URLs.

You can add a custom domain under *Project → Settings → Domains*.

## Updating content (no coding needed)

All content is stored in `src/data/`:

| File | What to edit |
|---|---|
| `site.js` | Club email, address, social links, founding date |
| `events.js` | Add a mission to `missions`, and add announced events to `upcoming` |
| `team.js` | Fill in `currentCrew` every year and update the faculty coordinator |
| `newsletters.js` | Add each month's newsletter with its public link |
| `facts.js` | The rotating space facts |

**Adding an event with photos:**
1. Create the folder `public/images/events/<event-id>/`.
2. Add `cover.webp` and the event photos, named `1.webp`, `2.webp`, and so on.
3. Add an entry to `missions` in `src/data/events.js`, with `photos` set to the number of photos.

**Adding a team member photo:** put a portrait (about 480×560, `.webp`) in `public/images/team/` and reference it as `/images/team/name.webp`.

> Tip: convert images to WebP before uploading (for example with [squoosh.app](https://squoosh.app)). The old site was 151 MB; this one is about 3 MB.

## Project structure

```
├── index.html              # page markup
├── public/                 # static files served as-is
│   ├── fonts/              # Brave Eighty One (display font from the original site)
│   └── images/             # brand, events, team (all optimised WebP)
├── src/
│   ├── main.js             # entry: wires all modules
│   ├── data/               # ← edit content here
│   ├── modules/            # aurora (WebGL), sky (ISS/moon), crew, gallery, missions, orbit, launch, ui
│   └── styles/main.css     # all styles (design tokens at the top)
├── vite.config.js
└── vercel.json
```

## External services

- **ISS position:** [wheretheiss.at](https://wheretheiss.at) public API, polled every 5 s while the section is on screen. If the API is unavailable, the tracker shows "Telemetry offline".
- **Globe land outlines:** Natural Earth data via the `world-atlas` package on jsDelivr. If it can't be loaded, the globe falls back to a wireframe.
- **Fonts:** Space Grotesk and JetBrains Mono from Google Fonts.

---
Designed & built by the SEDS Web Team · VIT-AP University
