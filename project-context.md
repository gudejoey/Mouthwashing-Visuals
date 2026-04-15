# THEATRICAL PRESENTATION SLIDES — PROJECT CONTEXT

## Overview
I'm building a series of HTML slides for projected visual cues in a stage production. Each slide is a standalone `.html` file meant to be displayed fullscreen on a projector. The story involves a cargo spaceship called the Tulpar and events surrounding a crash.

## Font & Base Style
- Font: **WDXL Lubrifont TC** from Google Fonts
- All text is **uppercase**
- Background is always **black** (`rgb(0,0,0)`)
- Every slide includes a **VHS overlay** (scanlines + flicker + chromatic aberration + vignette) using `body::before` and `body::after` pseudo-elements
- Exception: video-only slides have NO VHS overlay, NO text, NO font imports

### Standard HTML boilerplate (every slide except video-only):
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=WDXL+Lubrifont+TC&display=swap"
      rel="stylesheet"
    />
    <style>
      body {
        background-color: rgb(0, 0, 0);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
      }
      * {
        font-family: "WDXL Lubrifont TC", sans-serif;
        font-weight: 400;
        font-style: normal;
        margin: 0;
      }

      /* ... slide-specific styles ... */

      /* ═══ VHS OVERLAY (include on every non-video slide) ═══ */
      body::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: 999;
        pointer-events: none;
        background: repeating-linear-gradient(
          to bottom,
          transparent 0px,
          transparent 2px,
          rgba(0, 0, 0, 0.15) 2px,
          rgba(0, 0, 0, 0.15) 4px
        );
        animation: vhsFlicker 0.15s infinite;
      }
      body::after {
        content: "";
        position: fixed;
        inset: -10px;
        z-index: 998;
        pointer-events: none;
        box-shadow:
          inset 4px 0 12px rgba(255, 0, 0, 0.06),
          inset -4px 0 12px rgba(0, 100, 255, 0.06);
        background: radial-gradient(
          ellipse at center,
          transparent 60%,
          rgba(0, 0, 0, 0.4) 100%
        );
      }
      @keyframes vhsFlicker {
        0%   { opacity: 0.97; }
        50%  { opacity: 1; }
        100% { opacity: 0.98; }
      }
    </style>
    <title>Document</title>
  </head>
  <body>
    <!-- content -->
  </body>
</html>
```

---

## Slide Types

### 1. DATE SLIDES (e.g. "7 days before the crash")
- Big number: **128pt**, red (`rgb(255, 254, 232)`)
- Smaller label text below: **64pt**, same red
- Both **fade in** (no typewriter, no translateY), staggered (number first, label ~1s later)
- Centered horizontally and vertically
- HTML structure:
```html
<p class="big">7</p>
<p>days before the crash</p>
```
- Examples: `2.html`, `6.html`, `9.html`, `12.html`

### 2. CONTENT/SYSTEM SLIDES (e.g. ship computer readouts)
- Text color: **#ccc**
- Font size: **36pt**
- Centered horizontally and vertically
- Animation: **typewriter effect** using `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)` with `steps()`. **No cursor/border-right.**
- Lines appear sequentially, each starting after the previous finishes
- HTML structure:
```html
<div class="line">Text here.</div>
<div class="line">More text here.</div>
```
- Example: `3.html`

### 3. WARNING/ALERT SLIDES (system warnings)
- Text color: **red** (`rgb(255, 91, 91)`)
- Font size: **36pt**
- Same typewriter `clip-path` animation as content slides, just in red
- Lines appear sequentially
- Example: `4.html`

### 4. FLASHING WARNING SLIDES
- Text color: **red** (`rgb(255, 91, 91)`)
- Font size: **48pt**
- **No typewriter** — all lines flash in/out simultaneously on a **2-second cycle**:
```css
@keyframes flash {
  0%   { opacity: 1; }
  35%  { opacity: 0; }
  65%  { opacity: 0; }
  100% { opacity: 1; }
}
```
- All lines share the same `.warning` class, no delay offset
- Examples: `5.html`, `10.html`

### 5. SLASH BAR SLIDES (e.g. "////// Apologize //////")
- Text color: **red** (`rgb(255, 91, 91)`)
- Font size: **72pt**
- Single line with dense `////` on both sides of a centered word
- The line is **200vw wide** — do NOT add `margin-left: -50vw`, flexbox centering handles overflow
- `white-space: nowrap`, `letter-spacing: -0.02em`, `text-align: center`
- Animation: simple **fade in** (not typewriter)
- Examples: `7.html`, `8.html`

### 6. VIDEO-ONLY SLIDES
- No font, no VHS overlay, no text
- Fullscreen `<video autoplay>` with `object-fit: contain`
- Replace `YOUR_VIDEO.mp4` in `<source src="">` with actual file path
- Example: `11.html`

---

## Special Slide: 1.html (Opening Info Card)
- Two-column grid layout using `display: grid` with `grid-template-columns: auto auto`
- Labels: gray (`#999`), right-aligned, 32pt
- Values: white (`#fff`), left-aligned, 32pt
- Rows use `display: contents` to participate in parent grid
- Rows fade in staggered (0s, 1.5s, 3s, 4.5s) using per-row `@keyframes`
- "I hope this hurts" in red (`rgb(255, 91, 91)`) below grid, fades in at 6s, stays forever
- All info rows fade out simultaneously — baked into each row's keyframes (13s total animation)
- Fade-out at 84.6% (11s), fully gone at 100% (13s)
- Uses baked-in `@keyframes` per row (no JS) — this is critical because CSS transitions cannot override `animation-fill-mode: forwards`

---

## Slides Built So Far
1. `1.html` — Opening info card (ship name, crew, transit days → fades out → "I hope this hurts" remains)
2. `2.html` — "0 days before the crash" (date slide)
3. `3.html` — Orbital body detection, manual correction needed (content slide, #ccc, typewriter)
4. `4.html` — Extreme warning, collision course, autopilot engaging (warning slide, red, typewriter)
5. `5.html` — "AUTOPILOT DISENGAGED" + "WARNING — BRACE FOR IMPACT" (flashing warning)
6. `6.html` — "7 days before the crash" (date slide)
7. `7.html` — "////// Apologize //////" (slash bar slide)
8. `8.html` — "////// Talk to Jimmy //////" (slash bar slide)
9. `9.html` — "2 months after the crash" (date slide)
10. `10.html` — "MESSAGE INCOMING!" (flashing warning)
11. `11.html` — Mouthwashing ad video placeholder (video-only, no VHS, replace YOUR_VIDEO.mp4)
12. `12.html` — "3 months after the crash" (date slide)
13. `13.html` — "4 months after the crash" (date slide, cyan `rgb(0, 255, 255)`)

---

## Technical Notes
- Typewriter uses `clip-path` (not `width` animation) so text stays centered
- No typing cursor on any slide (no `border-right`)
- Fade-outs that need to override `animation-fill-mode: forwards` must use baked-in keyframes (not JS), as CSS transitions cannot override `forwards` fill
- Slash bar slides: do NOT use `margin-left: -50vw` — flexbox `align-items: center` naturally centers the 200vw element with equal overflow on both sides
- Each slide is a complete standalone HTML file with its own `<style>` block
- Slides are meant to be played fullscreen on a projector with no visible browser UI
- All animations are CSS-only (no JS) unless absolutely necessary
