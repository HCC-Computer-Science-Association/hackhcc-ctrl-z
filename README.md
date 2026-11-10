# HackHCC Ctrl Z

The website for **HackHCC Ctrl Z**, a 24-hour hackathon at Houston City College in 2027.

**Live site:** https://hcc-computer-science-association.github.io/hackhcc-ctrl-z/

The site boots like a 1995 PC into "Ctrl Z OS". Every section is a window on the desktop, and pressing **Ctrl+Z** reopens the last window you closed.

---

## Quick start (about 5 minutes)

You need [Node.js](https://nodejs.org/) 22 or newer.

1. Clone the repo:
   ```sh
   git clone https://github.com/HCC-Computer-Science-Association/hackhcc-ctrl-z.git
   ```
2. Install the dependencies:
   ```sh
   cd hackhcc-ctrl-z && npm install
   ```
3. Start the dev server:
   ```sh
   npm run dev
   ```
4. Open http://localhost:3000

Changes to files show up in the browser as soon as you save.

---

## Update the event info (about 2 minutes per change)

**All copy, dates and links live in one file: `content.js`.** You don't need to touch any other file to change what the site says.

Fields set to `null` show on the site as a yellow **TBA** tag.

| Field in `content.js` | What it changes |
|---|---|
| `event.dateLabel` | The date shown in About.txt and the Terminal |
| `event.venue` | The venue shown in About.txt and the Terminal |
| `event.registerUrl` | Makes the **Register** button open your sign-up form |
| `event.start` | Starts the taskbar countdown and highlights the live row in Schedule |
| `event.contactEmail` | Sponsor contact link in the Sponsors window |

For example, set `event.start` to `'2027-03-06T09:00:00-06:00'` for 9 AM Houston time.

Other things you can edit in the same file:

1. **`schedule`:** rows as hours after kickoff (`hour: 2` shows as `H+2`). The current rows are a **sample**, not the real schedule.
2. **`faq` and `rules`:** questions, answers and rules for the Help window.
3. **`sponsors` and `team`:** add `{ name, url, logo }` or `{ name, role }`. Put logo files in `public/`.
4. **`challenge`:** the "Can it run Doom?" pitch, idea-roller lists and draft rules.
5. **`tips`, `stickyNote`, `watermark`:** desktop extras.

---

## Deploy (automatic, about 1 minute)

Every push to `main` deploys to GitHub Pages.

1. Commit and push to `main`.
2. Watch the run under the repo's **Actions** tab.
3. When it turns green, the live site is updated.

The workflow lives in `.github/workflows/deploy.yml`. It runs the tests, builds the site, and publishes the `out/` folder. If the tests fail, nothing deploys.

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server at http://localhost:3000 |
| `npm test` | Runs the logic tests (window manager, countdown, Solitaire rules) |
| `npm run build` | Builds the static site into `out/` |
| `npm start` | Serves `out/` locally to check a build |

To test on your phone over Wi-Fi, run `npx next dev -H 0.0.0.0`. Then open `http://<your-computer's-IP>:3000` on the phone.

---

## What's on the desktop

**Event info**
- **About.txt:** the hook, the event facts and Register.
- **Schedule:** sample 24-hour timeline.
- **Help:** FAQ and rules.
- **Sponsors & Team:** empty until you add entries.

**Games**
- **Bug Hunt:** squash bugs in 30 seconds, with a saved best score.
- **Ping Pong:** first to 5 against the computer.
- **Solitaire:** drag cards, or click one to send it to its best spot.
- **Freedoom:** a free first-person shooter in a DOS emulator. Move with WASD, aim with the mouse, click to fire.
- **Challenge:** the "Can it run Doom?" side challenge, with an idea roller and draft rules.
- **Don't click me:** plays a certain 1987 music video the moment it opens. Closing the window stops it.

**Extras**
- **Terminal:** type `help` to list the commands.
- **Undo Bin:** reopens the last closed window.
- **TODO note, tip balloons, drifting clouds, right-click menu.**
- **Screensaver:** starts after 45 seconds idle.

**Window controls**
- Drag a window by its title bar.
- Resize it from the bottom-right corner.
- Maximize it with the button, or by double-clicking the title bar.
- **Esc** closes the front window.
- **Ctrl+Z** brings back the last closed window.

On phones, windows open full-screen.

---

## Project layout

```
app/                 Page shell: layout.js (fonts, metadata), page.js, globals.css (all styles)
components/boot/     The boot screen
components/desktop/  Desktop, Window, Taskbar, icons, living extras, screensaver
components/apps/     One file per window (About, Schedule, Faq, Sponsors, Terminal, games, Doom)
lib/                 Logic with no UI: window manager, time helpers, Solitaire rules, tests
public/              Static files: logo badge, Freedoom bundle
content.js           All site copy (edit this one)
```

**Design docs**
- `PRODUCT.md`: who the site is for.
- `DESIGN.md`: colours, fonts and components.

**How it stays fast**
- Only the desktop and About.txt load up front.
- Every other window downloads when you hover over or open it.
- Freedoom's 11 MB downloads only after you press **Play**.

---

## Adding a new window (about 30 minutes)

1. Create `components/apps/MyApp.jsx` that exports a React component.
2. In `components/desktop/Desktop.jsx`, add a loader to `loaders` and an entry to `APPS`.
3. Pick an icon. To make a new one, add a 16×16 pixel map to `components/desktop/icons.jsx`.
4. Run `npm run dev` and open it from the desktop.

---

## Freedoom and licenses

Freedoom runs through three pieces, all free to redistribute:

| Piece | What it is | License |
|---|---|---|
| [Freedoom](https://freedoom.github.io/) | The levels and art | BSD |
| MBF 2.03 | The DOS game engine ([source](https://www.doomworld.com/idgames/source/mbfsrc)) | GPL-2.0 |
| [js-dos](https://js-dos.com/) | The DOS emulator in the browser | GPL-2.0 |

The bundle is `public/doom/freedoom-v4.jsdos`, a zip file. It contains no files from the original commercial Doom. Bump the version in its name (and in `public/doom/index.html`) whenever you change it, or browsers keep the old copy.

The game runs inside `public/doom/index.html` in an iframe, so the emulator's styles don't leak into the site. That page also handles the controls:

- **WASD:** translated into the engine's own movement keys.
- **Mouse:** captured on the first click. Sideways motion turns you through the engine's turn keys; left click fires, right click opens doors. The emulated DOS mouse is switched off (`use_mouse 0` in `MBF.CFG`, `autolock=false` in the bundle's `dosbox.conf`) because it drifts and stalls when you reverse direction.

This repo is licensed under GPL-3.0 (see `LICENSE`).

**Brand rule:** the look is *inspired by* 90s desktops. Don't add Microsoft logos, the Windows name, or the Bliss wallpaper. Use only the badge in `public/badge.png`.

---

## Troubleshooting

**`npm run build` fails on fonts**
Cause: the build downloads Google Fonts. Fix: check your internet connection and run it again.

**The site works locally, but on GitHub Pages it has no styles**
Cause: GitHub Pages isn't set to deploy from Actions. Fix: go to **Settings → Pages → Source** and select **GitHub Actions**.

**Freedoom stays black**
Cause: the emulator loads from cdn.jsdelivr.net. Fix: check that a network filter isn't blocking that domain.

**The boot intro doesn't play again**
It plays once per browser tab. Open a new tab to see it again.
