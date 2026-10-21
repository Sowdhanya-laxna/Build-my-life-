# Build my life

Turn your real life into a living game. Complete missions, earn XP and coins,
unlock achievements and grow a virtual island. Pure HTML, CSS and JavaScript —
no install, no build step, no server, no account. Your progress stays in your browser.

## Run it

Double-click `index.html`. That's it.

To run the tests, open `tests.html` in a browser.

## Project structure

```
index.html          app shell
tests.html          in-browser unit tests
css/style.css       theme tokens and layout
js/config.js        categories, rewards, buildings, shop, achievements
js/progression.js   level maths, streaks, helpers
js/storage.js       versioned save (life-exe:save:v1), validation, backups
js/engine.js        game rules: complete mission, buy item, unlocks
js/ui.js            screens (HTML strings)
js/app.js           state, events, rendering
assets/             place for future images and sounds
```

Scripts are classic (non-module) files loaded in order so the app also works from `file://`.

## Host it

Upload the folder to any static host: GitHub Pages, Netlify, Vercel, Cloudflare Pages.

## Not in v1 yet

Mission editing, recurring missions, avatar customizer, rest days, focus timer,
Seeds of Intention, PWA/offline install.
