# ArikuTermiweestyleVencord

**AnvilTerminal for Discord**: terminal-green accents on VS Code grey, Fira Code for the UI and
JetBrains Mono for code, code blocks on a black terminal. The Discord side of
[ArikuTermiweestyleXfce](https://github.com/arikukaenbyou/ArikuTermiweestyleXfce) (same palette).
Servers (and folders) where someone is in voice or streaming get a **green ring**.
For [Vencord](https://vencord.dev) / [Vesktop](https://github.com/Vencord/Vesktop); works in BetterDiscord too.

## Install (Online Themes)

Vencord → **Settings → Themes → Online Themes**, paste:

```
https://raw.githubusercontent.com/arikukaenbyou/ArikuTermiweestyleVencord/main/AnvilTerminal.theme.css
```

It follows this repository, so fixes arrive by themselves. Use one of Discord's **dark** themes
(Dark, Darker or Midnight) — the light theme is left untouched.

BetterDiscord / offline: download `AnvilTerminal.theme.css` into your themes folder.

## Customise

Put this in QuickCSS (Vencord → Settings → Themes → Edit QuickCSS):

```css
:root {
  --anvil-font: 'gg sans', sans-serif;       /* back to Discord's UI font */
  --anvil-font-code: 'JetBrains Mono', monospace;
  --anvil-font-size-adjust: 0.5;             /* text size, default 0.475; none = Discord's sizes */
  --anvil-voice-ring: transparent;           /* no green ring on servers with people in voice */
}
```

## How it works

Instead of hashed class names, it overrides Discord's own design tokens, which change far less often:

- the **brand ramp** (`--blurple-1…99`) keeps Discord's saturation and lightness per step but gets the
  green hue, so buttons, switches, mentions, unread pills and focus rings all turn green with the
  contrast Discord designed for them;
- the **surface, text and border tokens** of the dark themes get the grey palette.

| | colour |
|---|---|
| accent | `#00ff66` |
| chat | `#1f1f1f` |
| channel list | `#181818` |
| server list | `#141414` |
| code blocks | `#0c0c0c` |
| text | `#d7fce1` |

## Development

```sh
node build.mjs   # palette lives in build.mjs -> AnvilTerminal.theme.css
npm test         # generator in sync, header, CSS sanity, and every token still exists in Discord's live CSS
```

CI runs the tests on every push and weekly, to catch Discord renaming a token.

## Licence

MIT, see [LICENSE](LICENSE). Fonts (Fira Code, JetBrains Mono) are loaded from Google Fonts under the SIL OFL.

---

## Po polsku

**AnvilTerminal dla Discorda**: zielone akcenty terminala na szarości z VS Code, Fira Code w interfejsie,
JetBrains Mono w kodzie i czarne tło bloków kodu. Ta sama paleta co motyw XFCE
[ArikuTermiweestyleXfce](https://github.com/arikukaenbyou/ArikuTermiweestyleXfce).

- **Instalacja:** Vencord → Ustawienia → Motywy → Motywy online, wklej link:
  `https://raw.githubusercontent.com/arikukaenbyou/ArikuTermiweestyleVencord/main/AnvilTerminal.theme.css`
  Motyw sam się aktualizuje z tego repo. Działa z ciemnymi motywami Discorda (Ciemny, Ciemniejszy, Północ).
- **Zielona obwódka** oznacza serwery i foldery, na których ktoś jest na voice albo streamuje
  (wyłączysz ją przez `--anvil-voice-ring: transparent`).
- **Czcionki** zmienisz w QuickCSS przez `--anvil-font` i `--anvil-font-code`, a ich wielkość przez
  `--anvil-font-size-adjust` (domyślnie 0.475, czyli ok. 90%; `none` = rozmiary Discorda). Przykład wyżej.
- **Jak to działa:** motyw nie opiera się na nazwach klas, tylko na zmiennych kolorów Discorda.
  Skala „blurple” dostaje zielony odcień przy zachowanej jasności, więc kontrasty zostają takie,
  jak zaprojektował je Discord. Testy co tydzień sprawdzają, czy Discord nie zmienił nazw zmiennych.
