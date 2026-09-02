# Emerald Marketplace

A marketplace for Montserrat, West Indies — buy and sell listings, wanted ads,
island jobs, local shops and travel.

**Live demo:** _(GitHub Pages URL goes here once Pages is switched on)_

This is a Phase 1 **front-end demo**: the complete interface, running on sample
data. There is no backend yet — no accounts, database or payments — so
reloading the page resets it.

## Repository layout

```
app/     the source — see app/README.md
docs/    the built demo, served by GitHub Pages
```

Three pages are published:

| Page | What it is |
|---|---|
| `index.html` | the web app — fills the browser window |
| `phone.html` | the phone app — fills the screen on a real phone (current design) |
| `phone-and-web.html` | both side by side, sharing one state |

## Building

No dependencies and no build tooling. Edit the files in `app/`, then:

```
node app/build.js
```

That regenerates both bundles in `app/dist/` and refreshes `docs/`.

Open `app/web.html` (web app) or `app/index.html` (phone + web) directly in a
browser while working — no server needed.
