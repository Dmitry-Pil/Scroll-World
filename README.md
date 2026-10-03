# Scroll World — Time With You

A scroll-driven Vue 3 experience about making time for your dog. One continuous zoom-out film connects a run, a dog-friendly café, a street mural, and a game of fetch — full-screen video with large typography and word-by-word GSAP animations.

---

## Setup

Use Node.js 22.12 or newer and npm. Run commands from the project folder in an external terminal.

```bash
# install dependencies
npm ci

# start dev server
npm run dev

# build for production
npm run build

# preview the production build
npm run preview
```

Open the local URL printed by Vite in your browser. Use Vite rather than VS Code Live Server: the project needs its Vue compilation and module processing.

---

## Features

- **Scroll-driven video** — scroll down to move forward through the film and up to move backwards
- **Continuous visual journey** — four scenes connected through changes in scale and matching transitions
- **Word-by-word typography** — masked reveals and slide animations linked to the same scroll position as the video
- **Full-screen composition** — video preserves its aspect ratio and crops the edges to fill the viewport
- **Responsive footer** — project description, production credits, website tools, and authorship
- **Reduced motion** — a normal video player and a static caption for visitors who prefer less motion
- **Loading and error states** — visible feedback while the video loads or if playback fails

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Vue 3 | UI framework |
| Vite | Dev server and production build |
| GSAP | Text animations |
| SCSS/Sass | Styling with shared variables and component partials |
| Adobe Fonts | Helvetica Neue LT Pro web fonts |
| Codex / Visual Studio Code | Development workflow |

---

## Visual Production

Images were generated in Magnific using Seedream 5.0, then used to generate video with Seedance 2.5. The clips were assembled, trimmed, edited, and exported as one final MP4.

Concept, visual direction, image and video generation, video editing, website design, and development by Dmitry Pilipishin.

---

## Project Structure

- `src/components/ScrollVideo.vue` — video loading, scroll mapping, and frame seeking
- `src/components/StoryText.vue` — phrase timings and GSAP animations
- `src/components/SiteFooter.vue` — project information and credits
- `src/assets/videos/` — final edited video
- `src/scss/` — variables, base styles, and component styles
- `src/js/main.js` — Vue entry point

The technical readout is commented out in `ScrollVideo.vue`. Uncomment its template block to inspect video time and scroll progress during development.

---

## Deployment

Vercel configuration: **Vite** framework preset, **`npm run build`** build command, **`dist`** output directory.

`dist/` contains the generated production site. Both `dist/` and `node_modules/` are excluded from Git.

The live demo link will be added after deployment.
https://scroll-world-three.vercel.app/
