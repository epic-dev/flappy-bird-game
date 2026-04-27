# flappy-bird

A tiny clone of the famous HTML5 video game, built in JavaScript with [Phaser 3](https://phaser.io/phaser3).

[demo](https://flpbrd.netlify.app/)

## Features

- Tap **Space** to flap and keep the bird airborne through scrolling pipe gaps.
- Three lives per run — a collision or going off-screen costs one life and restarts the round.
- Progressive difficulty: pipe gaps tighten as your score crosses each threshold (`easy` → `normal` → `hard`).
- Best score is persisted in `localStorage` and shown on the **Score** screen.
- **Esc** pauses the game; resuming starts with a 3-second countdown.
- Background music with an on/off toggle in the main menu and in the bottom-left corner of every scene (preference is remembered between sessions).

## Run locally

```sh
npm install
npm run dev      # webpack-dev-server on http://localhost:8080
npm run build    # production build to ./build
```

Feel free to contribute.
