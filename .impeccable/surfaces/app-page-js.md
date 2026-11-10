---
version: 1
slug: "app-page-js"
primary_target: "app/page.js"
related_targets: []
---

# Surface brief: home (desktop)

Scope: the single-page site (`app/page.js`). Mode: Persuade.
Audience: students from many schools deciding whether to spend 24h at HackHCC Ctrl Z. Action: register (link TBA in mockup). Proof: the site itself behaves like the theme. Constraints: mockup, every undecided fact shows TBA; Win95-era inspired, never Microsoft assets.

## Direction contract

THESIS: The site is a working 90s-style desktop, "Ctrl Z OS", that boots by rewinding the clock from today to 1995; every section is an app window and Ctrl+Z is real navigation. Refuses the hackathon default: dark neon hero, countdown digits, row of feature cards.

OWN-WORLD: Royal blue #1738BB desktop with a 2px dither and authored cream pixel clouds; silver bevelled chrome; navy #000067 title bars; cream #F5E7CD document panes taken from the badge; pixel yellow for focus and highlights; red pixel hearts as "lives" in the taskbar; the badge's green bar as the countdown meter. Type: Pixelify Sans for chrome and display, VT323 only for the BIOS screen, Atkinson Hyperlegible for prose.

STORY: Visitor watches the year count down to 1995, lands on a desktop, reads About (24 hours, HCC, date/venue TBA), presses Register, then explores Schedule, Help, Sponsors.

FIRST VIEWPORT: Full-bleed desktop. Icon column top-left. About.txt window right of centre, ~620px: logo badge at full width, one-line hook, three fact cells (24 HOURS / DATE TBA / VENUE TBA), primary Register button bottom-right of the window. Taskbar bottom: Start, open-window buttons, hearts, countdown meter, clock.

FORM: Retro desktop OS, pinned by the user's brief; a pinned direction beats the roll. seed: none (unavailable)
Seed check: `impeccable concept-seed --check-seed none` exited 0 on 2026-11-09 (it printed a surface roll, key 553c22dc; not adopted because the user pinned the direction).

Signature interaction: closing a window pushes it on an undo stack; Ctrl+Z (or Recycle Bin / Edit > Undo) rewinds it back open with a short reverse-scale motion.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
