# Ethio Radio

A cross-platform mobile app for discovering and streaming Ethiopian radio stations, built with React Native and Expo.

Available on **Android** (API 26+) and **iOS** (16+).

---

## Features

- **Stream live radio** — play any of 80+ Ethiopian stations with a single tap
- **Browse & search** — filter stations by name, language, or tag
- **Favorites** — save preferred stations for quick access
- **Sleep timer** — auto-stop playback after 15, 30, 60, or 90 minutes
- **Curated picks** — featured stations including EBC, EBS, Ethio FM, Fana, and Sheger
- **Offline-resilient** — multiple API mirrors with a built-in curated fallback list

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React Native + Expo SDK |
| Language | TypeScript (strict) |
| Navigation | Expo Router (file-based) |
| State | Zustand |
| Styling | NativeWind (Tailwind for RN) |
| Audio | expo-av |
| Storage | AsyncStorage |

---

## Getting Started

**Prerequisites:** Node.js 18+, Expo CLI

```bash
# Clone the repo
git clone https://github.com/your-username/ethio-radio.git
cd ethio-radio

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Press `a` to open on an Android emulator, `i` for iOS simulator, or scan the QR code with the Expo Go app on a physical device.

---

## Project Structure

```
src/
  features/radio/   # Streaming screen, hooks, service, store, utils
  store/            # Global Zustand stores
  assets/           # Images and icons
app/                # Expo Router file-based routes
```

---

## Data Source

Station data is fetched from the [Radio Browser API](https://www.radio-browser.info/) with a curated fallback list of Ethiopian stations for reliability.
