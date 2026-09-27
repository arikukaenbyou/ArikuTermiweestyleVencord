// Builds AnvilTerminal.theme.css -- run: node build.mjs
// The palette is the one of the AnvilTerminal GTK/xfwm4 theme (ArikuTermiweestyleXfce):
// VS Code-grey surfaces, a black terminal for code, terminal-green accents.
//
// How it themes Discord: instead of chasing hashed class names it overrides Discord's own
// design tokens, which change far less often --
//   1. the "blurple" ramp (--blurple-N-hsl, 1..99) keeps Discord's saturation/lightness per
//      step but gets the green hue, so every brand-coloured bit (buttons, switches, mentions,
//      unread pills, focus rings) turns green with the contrast Discord designed for it;
//   2. the semantic background/text/border tokens of the dark themes get the grey surfaces.
// tests/theme.test.mjs checks that every token set here still exists in Discord's live CSS.
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
const REPO = 'https://github.com/arikukaenbyou/ArikuTermiweestyleVencord'

const C = {
  accent: '#00ff66',
  accent2: '#51ff77',
  hue: 145, // hue of the accent
  terminal: '#0c0c0c', // code blocks: the terminal stays black
  lowest: '#141414', // server list, app frame
  base: '#181818', // VS Code Dark Modern side bar -- channel/DM list
  low: '#1b1b1b',
  bg: '#1f1f1f', // VS Code Dark Modern editor -- chat
  high: '#242424',
  higher: '#2a2a2a',
  highest: '#303030',
  text: '#d7fce1',
  strong: '#f0fff4',
  muted: '#b7f7c8',
  subtle: '#8fb89a',
  dim: '#4f7a5c',
  border: '#1a4d1a',
  danger: '#ff3b3b',
  warn: '#ffc107',
}

// Discord's blurple ramp, steps 1..99: [saturation %, lightness %] (step 100 is black)
const RAMP = [[100,95.1],[100,94.5],[100,93.7],[100,92.9],[100,92.4],[100,91.6],[100,91],[100,90.2],[100,89.6],[100,89],[100,88.2],[100,87.6],[100,86.9],[100,86.3],[100,85.7],[100,85.1],[100,84.5],[100,83.7],[100,83.1],[100,82.5],[100,82],[100,81.4],[100,80.8],[100,80.2],[100,79.6],[100,79],[98.2,78.2],[98.2,77.8],[96.6,77.1],[96.7,76.5],[95.2,75.7],[93.8,74.9],[93.8,74.5],[92.5,73.7],[92.6,73.3],[91.4,72.5],[91.6,72],[90.4,71.4],[90.6,70.8],[89.5,70.2],[88.5,69.4],[88.6,69],[87.6,68.4],[87.8,67.8],[86.8,67.3],[87,66.9],[86,66.3],[86.2,65.9],[85.4,65.1],[85.6,64.7],[79.8,63.1],[74.5,61.6],[69.6,60],[65.9,58.6],[61.6,57.1],[58.4,55.7],[55.4,54.3],[51.9,52.7],[49.2,51.4],[46.7,50],[46.8,48.6],[46.9,47.3],[47.2,46.1],[47.4,44.7],[47.5,43.3],[47.9,42.2],[48.1,40.8],[48.5,39.6],[48.7,38.2],[49.2,37.1],[49.5,35.7],[50,34.5],[49.7,33.5],[50.3,32.4],[50.9,31.2],[51.3,29.8],[52.1,28.6],[52.9,27.5],[53.7,26.3],[53.5,25.3],[54.5,24.1],[55.6,22.9],[56.8,21.8],[57,21],[58.4,19.8],[58.3,18.8],[60,17.6],[62.4,16.7],[62.5,15.7],[64.9,14.5],[65.7,13.7],[68.8,12.5],[69.5,11.6],[70.4,10.6],[74.5,9.2],[75.6,8],[76.5,6.7],[76,4.9],[84.6,2.5]]
const OPACITY_STEPS = [1, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96]

const hsl = (s, l) => `${C.hue} calc(var(--saturation-factor, 1)*${s}%) ${l}%`
const green = (a) => `rgb(0 255 102 / ${a})`

const ramp = RAMP.map(([s, l], i) => `  --blurple-${i + 1}-hsl: ${hsl(s, l)};`).join('\n')
const opacity = OPACITY_STEPS.map((n) => `  --opacity-blurple-${n}-hsl: ${hsl(85.6, 64.7)};`).join('\n')

// semantic tokens of the dark themes (Discord defines them on .theme-dark/-darker/-midnight)
const TOKENS = {
  // surfaces
  '--app-frame-background': C.lowest,
  '--background-base-lowest': C.lowest,
  '--background-base-lower': C.base,
  '--background-base-low': C.low,
  '--background-surface-high': C.bg,
  '--background-surface-higher': C.high,
  '--background-surface-highest': C.higher,
  '--chat-background-default': C.bg,
  '--chat-background': C.bg,
  '--home-background': C.bg,
  '--panel-bg': C.base,
  '--modal-background': C.bg,
  '--modal-footer-background': C.base,
  '--bg-surface-raised': C.high,
  '--channeltextarea-background': C.high,
  '--input-background-default': C.lowest,
  '--card-background-default': C.low,
  '--embed-background': C.low,
  '--background-code': C.terminal,
  '--background-secondary-alt': C.low,
  // text
  '--text-default': C.text,
  '--text-strong': C.strong,
  '--text-muted': C.subtle,
  '--text-subtle': C.subtle,
  '--text-link': C.accent2,
  '--text-brand': C.accent2,
  '--text-code': C.muted,
  '--channels-default': C.subtle,
  '--channel-icon': C.dim,
  '--chat-text-muted': C.subtle,
  '--input-text-default': C.text,
  '--input-placeholder-text-default': C.dim,
  '--channel-text-area-placeholder': C.dim,
  '--interactive-text-default': C.subtle,
  '--interactive-text-hover': C.text,
  '--interactive-text-active': C.strong,
  '--interactive-icon-default': C.subtle,
  '--interactive-icon-hover': C.text,
  '--interactive-icon-active': C.strong,
  '--interactive-muted': C.dim,
  '--icon-default': C.subtle,
  '--icon-strong': C.text,
  '--icon-muted': C.dim,
  '--icon-subtle': C.dim,
  '--icon-link': C.accent2,
  '--icon-brand': C.accent,
  // lines
  '--border-subtle': green(0.1),
  '--border-muted': green(0.14),
  '--border-normal': green(0.2),
  '--border-strong': green(0.3),
  '--border-focus': C.accent,
  '--app-frame-border': green(0.12),
  '--input-border-default': green(0.18),
  '--input-border-hover': green(0.35),
  '--input-border-active': C.accent,
  '--chat-border': green(0.1),
  '--card-border-default': green(0.14),
  '--scrollbar-auto-thumb': C.border,
  '--scrollbar-auto-track': 'transparent',
  '--scrollbar-thin-thumb': C.border,
  '--scrollbar-thin-track': 'transparent',
  // hover/selected rows
  '--interactive-background-hover': green(0.06),
  '--interactive-background-active': green(0.1),
  '--interactive-background-selected': green(0.12),
  '--message-background-hover': 'rgb(255 255 255 / 0.025)',
  // brand controls: terminal green with black text, like the GTK theme's suggested buttons
  '--control-primary-background-default': C.accent,
  '--control-primary-background-hover': C.accent2,
  '--control-primary-background-active': '#00cc52',
  '--control-primary-text-default': '#000000',
  '--control-primary-text-hover': '#000000',
  '--control-primary-text-active': '#000000',
  '--control-primary-icon-default': '#000000',
  '--control-primary-icon-hover': '#000000',
  '--control-primary-icon-active': '#000000',
  '--switch-background-selected-default': '#00cc52',
  '--switch-background-selected-hover': C.accent,
  '--checkbox-background-selected-default': '#00cc52',
  '--checkbox-background-selected-hover': C.accent,
  '--background-brand': '#00cc52',
  // feedback keeps its meaning, in the palette of the dashboard
  '--text-feedback-critical': C.danger,
  '--text-feedback-warning': C.warn,
  '--text-feedback-positive': C.accent,
  '--status-positive': C.accent,
  '--status-warning': C.warn,
  '--status-danger': C.danger,
  // ANSI colours in ```ansi code blocks
  '--ansi-green': C.accent,
  '--ansi-bright-green': C.accent2,
}

const tokens = Object.entries(TOKENS).map(([k, v]) => `  ${k}: ${v};`).join('\n')

const css = `/**
 * @name AnvilTerminal
 * @author arikukaenbyou
 * @version ${pkg.version}
 * @description Terminal-green on VS Code grey -- the AnvilTerminal desktop theme for Discord. Dark themes only.
 * @source ${REPO}
*/

/* Generated by build.mjs -- edit the palette there, not here. */

@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

/* ---- settings: override these in your QuickCSS to taste ---- */
:root {
  --anvil-font: 'Fira Code', 'JetBrains Mono', monospace;
  --anvil-font-code: 'JetBrains Mono', 'Fira Code', monospace;
  /* text size: x-height as a fraction of the font size. Monospace fonts run wider than
     Discord's gg sans, so they are scaled down to ~90 % (Fira Code alone is 0.527);
     'none' = Discord's own sizes, a bigger number = bigger text */
  --anvil-font-size-adjust: 0.475;
}

html {
  font-size-adjust: var(--anvil-font-size-adjust);
}

:root:root {
  --font-primary: var(--anvil-font);
  --font-headline: var(--anvil-font);
  --font-code: var(--anvil-font-code);
  /* brand ramp: Discord's lightness per step, terminal-green hue */
${ramp}
${opacity}
}

/* doubled for specificity: wins over Discord's .theme-dark whatever the load order */
:is(.theme-dark, .theme-darker, .theme-midnight):is(.theme-dark, .theme-darker, .theme-midnight) {
${tokens}
}

/* ---- a few terminal touches ---- */
::selection {
  background: ${green(0.28)};
  color: ${C.strong};
}

:is(.theme-dark, .theme-darker, .theme-midnight) :is(pre code, code.inline) {
  background: ${C.terminal};
  border: 1px solid ${green(0.14)};
  color: ${C.muted};
}

:is(.theme-dark, .theme-darker, .theme-midnight) [role='textbox'] {
  caret-color: ${C.accent};
}
`

writeFileSync(path.join(ROOT, 'AnvilTerminal.theme.css'), css)
console.log(`AnvilTerminal.theme.css: ${Object.keys(TOKENS).length} tokens + ${RAMP.length + OPACITY_STEPS.length} ramp steps`)
