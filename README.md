# Ethio Radio

Cross-platform mobile app for Android & iOS — Ethiopian radio streaming, built with React Native + Expo.

## Quick Start

```bash
npm install
npx expo start
```

Press `a` for Android emulator, `i` for iOS simulator.

## Documentation

| File | Purpose |
|---|---|
| `CLAUDE.md` | AI context — tech stack, conventions, project overview |
| `SKILLS.md` | Feature build playbook, patterns, templates |
| `BLUNT.md` | Hard rules, guardrails, banned patterns |
| `permissions.md` | Approved native modules and device permissions |
| `.claude/mcp.json` | MCP server connections (Linear, etc.) |
| `.claude/settings.json` | Claude Code permissions and project settings |

## Linear Project

Issues tracked at: [linear.app/myprojectspace](https://linear.app/myprojectspace)  
Team: **Ethio Radio**

Branch format: `feat/MY-{id}-{description}`  
Commit format: `feat(MY-{id}): description`

## Tech Stack

- **React Native** + **Expo SDK**
- **TypeScript** (strict)
- **Expo Router** (file-based navigation)
- **Zustand** (state management)
- **NativeWind** (Tailwind styling)
- **expo-sqlite** (local database)
- **EAS Build** (CI/CD)

## Project Structure

```
src/
  features/radio/   # Radio streaming feature (screen, store, hooks, utils)
  store/            # Global Zustand stores
  assets/           # Images, icons
app/                # Expo Router file-based routes
```
