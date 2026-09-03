# Access MNI

A marketplace for Montserrat, West Indies — buy and sell listings, wanted ads,
island jobs, local shops and travel.

**Live demo:** https://yukmedia.github.io/accessmni/

This is a Phase 1 **front-end demo**: the complete interface, running on sample
data. There is no backend yet — no accounts, database or payments — so
reloading the page resets it.

## Repository layout

```
app/     the source — see app/README.md
docs/    the built demo, served by GitHub Pages
```

Two pages are worth sending anyone:

| Page | What it is |
|---|---|
| `index.html` | the web app — responsive, desktop down to phone |
| `phone.html` | the phone app — fills the screen on a real phone |

Two more are published as moving parts rather than destinations:

| Page | What it is |
|---|---|
| `admin.html` | the admin dashboard — **reached from inside the web app**, avatar chevron → Admin tools. Published because the app loads it in an iframe; on its own it has no way back to the marketplace. |
| `phone-and-web.html` | both mocks side by side, as the design draws them |

## Building

The published pages are generated from the Claude Design files:

```
node app/from-handoff.js <unzipped-handoff-folder>   # a .zip of .dc.html sources
node app/from-export.js  <standalone-export.html>    # one self-contained file
```

See HANDOFF.md for what each does and why. `app/` also contains an older
hand-written build (`node app/build.js`) that is no longer published.
