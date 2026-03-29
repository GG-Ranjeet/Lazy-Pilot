# Lazy Pilot: Android Remote Control (Tauri + React)

Desktop app for controlling and mirroring an Android device over ADB on Windows.

The app combines:

- A React + TypeScript frontend (Vite)
- A Tauri (Rust) backend that runs ADB/scrcpy commands

## Features

- Detect default network gateway from Windows
- List connected ADB devices
- Switch device to TCP/IP mode on port 5555
- Connect to device over Wi-Fi using gateway:5555
- Start scrcpy mirroring
- Send quick actions:
  - Home button
  - Power button
  - PIN entry

## Prerequisites

- Windows 10/11
- Node.js (recommended LTS)
- Rust toolchain (Cargo + rustc)
- Tauri v2 build requirements for Windows (MSVC/Build Tools + WebView2)
- Android device with Developer Options and USB debugging enabled
- `adb.exe` and `scrcpy.exe` available by one of these methods:
  - In a folder you select in the app (recommended)
  - Or on your system PATH

## Project Layout

- `src/` React UI components
- `src-tauri/src/commands.rs` Tauri commands that execute ADB/scrcpy operations
- `src-tauri/src/lib.rs` Tauri app setup and command registration
- `scrcpy/` helper folder for local scrcpy/adb-related binaries and scripts

## Install

```bash
npm install
```

## Run In Development

```bash
npm run tauri dev
```

This starts:

- Vite dev server (`http://localhost:5173`)
- Tauri desktop shell

If you only want the frontend:

```bash
npm run dev
```

## Build

```bash
npm run tauri build
```

## Typical Usage Flow

1. Launch the app.
2. Click the folder button and select the directory containing both `adb.exe` and `scrcpy.exe`.
3. Click **Get Gateway**.
4. Click **Set Port** (sets ADB TCP mode to `5555`).
5. Click **Connect ADB**.
6. Click **Start Mirror**.
7. Use **Go Home**, **Power Button**, and **Enter PIN** as needed.

## Available Scripts

- `npm run dev` - Start Vite frontend
- `npm run build` - TypeScript build + Vite production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview Vite build
- `npm run tauri dev` - Run desktop app in dev mode
- `npm run tauri build` - Build desktop app

## Troubleshooting

- **"Missing binaries in path"**
  - Ensure the selected folder contains both `adb.exe` and `scrcpy.exe`.
- **ADB connect fails**
  - Verify device is authorized via USB first (`adb devices`).
  - Ensure phone and PC are on the same network.
  - Re-run Set Port and Connect ADB.
- **Mirror does not start**
  - Confirm `scrcpy.exe` is valid and executable.
  - Try launching `scrcpy.exe` manually once to confirm dependencies.

## Notes

- Current implementation targets Windows command behavior.
- Some UI sections (for example mirror toggles/browser area) are present as placeholders and may not yet be fully wired to backend command arguments.
