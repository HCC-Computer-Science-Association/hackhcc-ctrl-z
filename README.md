# hackhcc-ctrl-z

The website for HackHCC Ctrl Z, Houston City College's 24-hour hackathon in 2027. It boots like a 90s PC into "Ctrl Z OS", and each section is a window on the desktop.

## Run

```sh
npm install
npm run dev     # http://localhost:3000
npm test        # window-manager and countdown tests
npm run build   # static site in out/
```

## Edit the content

All copy, dates and links live in `content.js`. Fields set to `null` show as **TBA**.

| Field | Effect |
|---|---|
| `event.start` | Turns on the taskbar countdown and highlights the live row in the Schedule window |
| `event.registerUrl` | Makes the Register button work |
| `event.venue`, `event.dateLabel` | Fill the About window facts |

## Deploy

Every push to `main` deploys to GitHub Pages through `.github/workflows/deploy.yml`. One-time setup: go to repo **Settings → Pages → Source** and select **GitHub Actions**.
