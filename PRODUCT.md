# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (React, App Router) with static export (`output: 'export'`), deployed to GitHub Pages under the `/hackhcc-ctrl-z` base path. The user chose React and explicitly declined Vite.

## Users

College and university students from many schools, mostly in the Houston area. They are deciding whether to spend a weekend at a 24-hour hackathon. Many are first- or second-time hackers. Sponsors and judges also visit, but they are a secondary audience.

## Product Purpose

This is the event website for **HackHCC Ctrl Z**, a 24-hour hackathon run at Houston City College (HCC) in 2027. The site has three jobs:
- make the event feel worth a weekend
- answer logistics questions
- get students to register

Success means a visitor understands what the event is and registers, or bookmarks the site until registration opens.

## Positioning

The theme is "Ctrl Z": undo, rewind, retro computing. The site acts as the theme instead of describing it. It boots like a mid-90s PC and lands on a desktop, and every section is an app window on that desktop.

## Operating Context

Visitors find the site through shared links (Discord, Instagram, class announcements). They open it on phones as often as on laptops.

## Capabilities and Constraints

**Sections:**
- About + Register
- Schedule
- FAQ + Rules
- Sponsors + Team

**Undecided as of 2026-11-09** (the user expects these in about 2 weeks):
- event date
- venue
- registration link
- schedule details
- sponsors
- team

The current build is a **mockup**. Undecided facts must render as clearly marked "TBA" placeholders. Do not invent them.

**Confirmed:** the event lasts 24 hours.

**Performance:** the site must feel dynamic, yet stay optimized:
- static HTML first paint
- lazy-loaded windows
- small JS budget

**Out of scope for now:** a playable Doom window. Keep the window system able to add it later as a lazy-loaded app.

## Brand Commitments

- **Name:** "HackHCC Ctrl Z". The logo shows "HACK" in white, "HCC" in yellow, and "Ctrl + Z" as two keycaps.
- **Logo:** the badge in `logo.png`. Use only the badge. The rest of that image is a screenshot of a Microsoft Paint window over the Microsoft "Bliss" wallpaper, which the site must not reuse.
- **Badge palette:**
  - deep navy `#000067`
  - royal blue `#1738BB`
  - cream `#F5E7CD`
  - pixel yellow
  - white keycaps
  - a green progress bar
  - three red pixel hearts
- **Look:** a retro, Windows-95-era desktop is the user's pinned direction. It is *inspired by*, never a copy: no Microsoft logos, no "Windows" wordmark, no Bliss wallpaper, no startup sound.

## Evidence on Hand

- `logo.png` (the badge inside a composite image).
- No sponsors, testimonials, past-event photos or statistics exist. Do not fabricate any.

## Product Principles

1. The theme is the interface. Undo, rewind and retro desktops are the navigation, not decoration.
2. Logistics stay one click away. The playfulness never hides the date, the place or the register action.
3. Honest placeholders. A clear "TBA" beats a made-up fact.
4. Fast on a phone. A slow retro site breaks the illusion.

## Accessibility & Inclusion

- The desktop metaphor must stay keyboard-operable and screen-reader-legible.
- The boot animation must be skippable and must respect `prefers-reduced-motion`.
