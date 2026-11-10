---
name: HackHCC Ctrl Z
description: A 24-hour hackathon site that boots into Ctrl Z OS, a working 90s-style desktop where Ctrl+Z is real navigation.
colors:
  navy: "#000067"
  royal: "#1738bb"
  royal-dk: "#12309f"
  sky: "#8fb4ff"
  cream: "#f5e7cd"
  cream-dk: "#e6d3b0"
  yellow: "#ffe600"
  ink: "#0b0b1a"
  ink-soft: "#3a3550"
  silver: "#c3c3cc"
  silver-lt: "#e4e4ec"
  shade: "#7d7d86"
  white: "#ffffff"
  red: "#e0242f"
  green: "#4fbf3a"
  bios-black: "#000000"
  bios-grey: "#c8c8c8"
typography:
  display:
    fontFamily: "Jersey 15, sans-serif"
    fontSize: "clamp(28px, 3.6vw, 36px)"
    fontWeight: 400
    lineHeight: 1.05
  headline:
    fontFamily: "Jersey 15, sans-serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
  title:
    fontFamily: "Jersey 15, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1
  body:
    fontFamily: "Atkinson Hyperlegible, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Jersey 15, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.08em"
  bios:
    fontFamily: "VT323, monospace"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.35
rounded:
  none: "0px"
spacing:
  bevel: "3px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  window:
    backgroundColor: "{colors.silver}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "3px"
  window-title-focused:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.title}"
    height: "26px"
  window-title-inactive:
    backgroundColor: "{colors.shade}"
    textColor: "{colors.silver-lt}"
    height: "26px"
  button:
    backgroundColor: "{colors.silver}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "4px 20px"
    height: "36px"
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.navy}"
    rounded: "{rounded.none}"
    padding: "4px 20px"
    height: "36px"
  menu-item-hover:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    padding: "4px 10px 4px 22px"
  document-pane:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink-soft}"
    padding: "20px 22px 16px"
  fact-cell:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.yellow}"
    padding: "10px 12px"
  taskbar:
    backgroundColor: "{colors.silver}"
    textColor: "{colors.ink}"
    height: "44px"
  taskbar-button:
    backgroundColor: "{colors.silver}"
    height: "34px"
    padding: "0 10px"
  sticky-note:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.navy}"
    width: "210px"
    padding: "12px 14px 14px"
  game-card:
    backgroundColor: "{colors.silver}"
    textColor: "{colors.ink}"
    width: "min(320px, 88%)"
    padding: "16px 18px"
  tba-tag:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.navy}"
    padding: "0 0.4em"
  terminal:
    backgroundColor: "{colors.bios-black}"
    textColor: "{colors.bios-grey}"
    typography: "{typography.bios}"
---

# Design System: HackHCC Ctrl Z

## Overview

**Creative North Star: "Ctrl Z OS"**

The site is a working mid-90s desktop operating system dressed in the HackHCC Ctrl+Z badge's colours. A royal-blue dithered desktop carries pixel icons, drifting cream clouds, a yellow sticky note and silver bevelled windows; every section of the event is an app window, and closing a window is undoable. The look is Win95-era *inspired*, built from first principles in CSS: bevels are four inset hairlines, the ground is a conic-gradient checker, icons are hand-authored 16x16 pixel maps drawn as SVG rects.

Density is that of a real desktop: small chrome, square corners, everything one click from the taskbar. Pixel type (Jersey 15) owns the chrome, labels and display lines; Atkinson Hyperlegible carries every sentence a visitor must actually read. VT323 appears only on the BIOS boot screen and in the Terminal app, where it reads as the machine talking.

The world stays light in dark mode on purpose: it is a 90s screen, not a theme-aware app.

**Key Characteristics:**
- Badge palette only: navy, royal, sky, cream, yellow, ink, silver family, red, green.
- Square corners everywhere; depth comes from 2px bevels, not radius or blur.
- Dithered royal desktop ground (4px checker of royal and royal-dk).
- Pixel display type for chrome, legible sans for prose.
- Motion tells the Ctrl+Z story: the boot rewinds the clock to 1995, a closed window rewinds back open.

## Colors

The palette is lifted directly from the badge: two blues, a cream, a pixel yellow, hearts red and progress-bar green, set on silver OS chrome.

### Primary
- **Badge Royal** (royal): the desktop ground (dithered with Royal Shadow), the right end of focused title-bar gradients, links, game HUD numbers, schedule times.
- **Royal Shadow** (royal-dk): only the second cell of the desktop dither.
- **Deep Badge Navy** (navy): focused title bars (gradient navy to royal), menu and Start-menu hover rows, fact cells, headings, text on yellow, the Start rail, the theme colour.

### Secondary
- **Pixel Yellow** (yellow): focus outline, selection, the primary Register button, TBA tags, the sticky note, the live schedule row, the selected card outline, terminal input and caret. It is the "look here" colour.
- **Cream Paper** (cream): document panes (About), pixel clouds, the Bug Hunt field, summary hover. Cream Shadow (cream-dk) is its darker step.
- **Sky** (sky): fact-cell labels on navy, Pong CPU paddle, icon highlights.

### Tertiary
- **Heart Red** (red): taskbar lives hearts, red playing-card suits, the LIVE tag.
- **Meter Green** (green): the countdown meter and boot progress bar, Bug Hunt splats, terminal prompt glyphs in icons.

### Neutral
- **Chrome Silver** (silver): window, menu, taskbar, button and game-card faces.
- **Silver Light** (silver-lt): inner bevel highlight, table rules, inactive title text.
- **Bevel Shade** (shade): inner bevel shadow, inactive title bars, disabled text, separators.
- **Ink** (ink): body text and outer bevel shadow.
- **Ink Soft** (ink-soft): secondary prose, status bars, hints.
- **White** (white): outer bevel highlight, sunken field faces, playing cards.
- **BIOS Black / BIOS Grey** (bios-black, bios-grey): the boot screen, terminal, screensaver and Doom screen only.

### Named Rules
**The Badge Palette Rule.** Every colour on screen comes from the badge or the silver chrome family. New surfaces pick from these tokens; no new hues.

**The Yellow Means Attention Rule.** Yellow marks focus, the primary action, live or TBA state, and selection. It is never a decorative fill.

## Typography

**Display Font:** Jersey 15 (with sans-serif fallback), exposed as `--f-pixel`
**Body Font:** Atkinson Hyperlegible 400/700 (with system-ui, sans-serif), exposed as `--f-prose`
**BIOS Font:** VT323 (with monospace), exposed as `--f-bios`

**Character:** A chunky pixel face for everything the "OS" says, paired with a highly legible sans for everything the event says. The direction contract named Pixelify Sans; the build shipped Jersey 15, and the build is canonical.

### Hierarchy
- **Display** (400, clamp(28px, 3.6vw, 36px), 1.05): the About hook line, balanced. One per document window.
- **Headline** (400, 22px): in-window h3 section heads in navy; also the Start rail wordmark.
- **Title** (400, 19-21px, 1): window titles, menubar, taskbar, buttons (21px), Start menu items (20px), game HUD.
- **Body** (400, 16px, 1.5): all prose, capped at 62ch. Secondary sizes 15px (hints, table cells) and 14px (notices, details).
- **Label** (400, 17px, 0.08em, uppercase): fact-cell terms on navy; TBA tags (0.06em, uppercase) in pixel type on yellow.
- **BIOS** (400, 22px, 1.35; Terminal 20px/1.25): boot lines and terminal output only.

### Named Rules
**The Two Voices Rule.** Pixel type for chrome, labels and short display lines; Atkinson for any sentence a visitor needs to read. Never set a paragraph in Jersey 15.

**The BIOS Only Rule.** VT323 appears only on black: the boot screen and the Terminal app.

## Layout

The page is a fixed full-viewport desktop: a grid of the desktop area over a 44px taskbar. Desktop icons flow in a column-first grid from the top left (96px columns, 78px rows); windows are absolutely positioned, draggable, and clamped to stay 8px inside the desktop (width `min(--w, 100% - 16px)`). The About window sits right of centre; the sticky note pins top right at 2deg rotation; the watermark sits bottom right.

Spacing is small and pixel-literal: 3px window padding (the bevel gutter), then 4, 8, 12, 16 and 24px steps.

**Responsive (max-width 640px):** icons reflow into a centred row grid of 88px cells; windows go full-bleed (`inset: 0`, no drag) with taller 32px title bars and 30x26px title buttons; the sticky note, watermark and Solitaire hint hide; fact cells stack to one column; the status bar stacks with a full-width button; taskbar buttons collapse to 44px icon-only; the countdown label and clock hide; balloons shrink to `min(280px, 100vw - 24px)`.

## Elevation & Depth

Depth is structural, not ambient. Every control and surface is raised, pressed or sunken through four inset 1px hairlines (ink, white, shade, silver-lt), exactly like period OS chrome. Floating layers (windows, menus, message boxes, game cards, sticky note, balloon) add one soft navy-tinted drop shadow so they lift off the dithered ground.

### Shadow Vocabulary
- **Raised** (`--raised`): buttons, window frames, menus, scrollbar thumbs, table heads, kbd keycaps.
- **Pressed** (`--pressed`): active buttons, open menus, the pressed Start and active task button (plus a 2px silver checker fill).
- **Sunken** (`--sunken`): fields, document panes, tray, meters, terminal, felt, status line.
- **Float** (`0 10px 28px -8px rgb(0 0 40 / 0.55)`, deeper while dragging): paired with Raised on windows and similar floating layers.

### Named Rules
**The Hairline Bevel Rule.** Depth is drawn with the three bevel tokens. No border-radius, no blur-only cards, no hard offset shadows; the only offset shadow is the 2px playing-card edge, which is part of the card.

## Shapes

Square corners throughout (0px radius, enforced even on cards and keycaps). Silhouettes are pixel-literal: icons, clouds, close glyphs and checkmarks are drawn on a pixel grid with `crispEdges` or `image-rendering: pixelated`. The only non-orthogonal forms are the sticky note's 2deg tilt and the balloon's triangular tail.

## Components

### Buttons
- **Shape:** square (0px), silver face with the Raised bevel, 36px minimum height, pixel type at 21px.
- **Primary:** yellow face, navy text, 1px ink inset outline; hover lightens the yellow. Used once per window for the main action (Register).
- **Active:** swaps to the Pressed bevel. Title-bar buttons are 22x20px silver bevelled squares with pixel SVG glyphs.
- **Focus:** global 2px yellow outline, 2px offset, with a 4px navy ring behind it.

### Windows
- **Frame:** silver, Raised bevel plus Float shadow, 3px padding.
- **Title bar:** 26px, navy-to-royal gradient with white pixel title when focused; flat shade with silver-lt text when not. 16px pixel icon left, minimize and close right.
- **Body:** scrolls independently; status bar sticks to the bottom in silver with ink-soft pixel text.

### Menus and Message Box
- **Menubar:** pixel 19px items that take the Pressed bevel on hover/open.
- **Drop and context menus:** silver Raised panel, 200-210px min width; rows highlight navy with white text; shortcuts right-aligned as plain kbd; disabled rows are shade with a white emboss. Separators are a shade-over-white double hairline.
- **Message box:** a centred mini-window (max 360px) over a 25% navy scrim, always-focused title bar, centred 88px action buttons.

### Taskbar and Tray
- **Taskbar:** 44px silver bar with a white top highlight; Start and task buttons are 34px Raised; the pressed state adds a 2px silver checker.
- **Start menu:** opens upward with a clip-path wipe; 30px navy-to-royal rail with a vertical yellow "Ctrl Z OS" wordmark.
- **Tray:** a sunken well holding red pixel hearts (undo history, clickable), the green segmented countdown meter (stepped idle animation while the date is TBA), and a tabular clock.

### Balloon Tip
A 280px pale-cream note with a 1px ink border, soft shadow and a triangular tail pointing at the tray; pixel navy heading, 15px prose, and a title-bar-style close button. It fades and rises in, holds, then fades out over 9s.

### Sticky Note
A 210px yellow note tilted 2deg, navy pixel text, a navy-underlined heading and sunken white checkboxes with a navy pixel tick; checked items strike through.

### Watermark
Bottom-right desktop text at 62% white: pixel title over a prose line; turns full white on hover. Hidden on phones.

### Game Card
A centred silver Raised panel with Float shadow (max 320px) over a game field, holding an h3, a short ink-soft line and buttons. Used for start, pause and win states across Bug Hunt, Pong, Solitaire and Doom.

### Document Pane and Fact Cells
Cream sunken pane for reading. Fact cells are a 3-up grid on an ink 2px gutter: navy cells, sky uppercase pixel term, yellow pixel value. TBA values render as the yellow TBA tag.

### Motion
- **Boot:** BIOS lines appear on a timed sequence; the year counts down from 2026 to 1995 via an animated `@property` integer; a navy splash shows the badge with a stepped green bar; the whole screen fades at 2.6s. Skippable by click or key; skipped on repeat visits.
- **Icon pop-in:** icons rise and scale in (0.35s, ease-out), staggered 70ms after the boot ends.
- **Window open:** fade and scale from 0.94 (0.32s, `cubic-bezier(0.16, 1, 0.3, 1)`).
- **Window rewind (signature):** a reopened window unblurs, resaturates and wipes down from scale 0.6 over 0.45s.
- **Clouds:** four pixel clouds drift linearly across the desktop over 90-200s.
- **Balloon:** 9s fade-rise, hold, fade.
- **Screensaver:** after idle, Ctrl and Z keycaps bounce on black, their bottom edge hue shifting on each wall hit; any input exits.
- **Reduced motion:** the boot is skipped entirely, clouds freeze in place, and all CSS animations and transitions collapse to near zero.

## Do's and Don'ts

### Do:
- **Do** build every new control from the silver face plus the Raised, Pressed and Sunken bevel tokens.
- **Do** use yellow for focus, the single primary action, TBA and live state.
- **Do** set chrome, labels and short display lines in Jersey 15 and every readable sentence in Atkinson Hyperlegible, prose capped at 62ch.
- **Do** draw new icons as original 16x16 pixel maps in the badge palette, rendered as crisp SVG.
- **Do** render every undecided fact as a yellow TBA tag.
- **Do** give every new window the full-bleed treatment and 32px title bar at 640px and below.
- **Do** honour reduced motion: no boot, frozen clouds, near-zero animation.

### Don't:
- **Don't** use Microsoft logos, the "Windows" wordmark, the Bliss wallpaper or a startup sound; the world is Win95-inspired, never a copy.
- **Don't** use any part of logo.png except the badge.
- **Don't** round corners or replace bevels with blurred card shadows.
- **Don't** use VT323 outside the boot screen and Terminal.
- **Don't** introduce hues outside the badge palette and silver chrome family.
- **Don't** switch the desktop to a dark theme in dark mode.
