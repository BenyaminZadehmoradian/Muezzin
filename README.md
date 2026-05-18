# Muezzin

Muezzin is an Electron desktop app for viewing Islamic prayer times, playing Adhan audio, reading Qur'an content, and managing prayer-related settings from a local desktop interface.

## Features

- Daily prayer times with countdowns
- Configurable location, time zone, and calculation preferences
- Adhan audio playback and notification settings
- Qur'an and related content views
- System tray support and auto-start options

## Tech Stack

- Electron
- Electron Forge
- Electron Builder
- Bootstrap 5
- `adhan` for prayer time calculations

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Install

```bash
npm install
```

### Run the App

```bash
npm start
```

### Package the App

```bash
npm run package
```

### Build Distribution Artifacts

```bash
npm run build
```

## Project Structure

```text
src/
  main/         Main Electron window
  settings/     Settings UI
  quran/        Qur'an UI
  mediaPlayer/  Hidden audio player window
  common/       Shared logic and translations

ressources/
  audio/        Adhan and audio assets
  data/         Static JSON data
  fonts/        App fonts and icon fonts
  images/       App images and icons
  quran/        Qur'an metadata and content
```

## Notes

- Generated folders such as `out/`, `dist/`, and `node_modules/` are not meant for GitHub commits.
- The repository was verified to start with `npm start` and package successfully with `npm run package` on Linux on May 18, 2026.

## License

MIT
