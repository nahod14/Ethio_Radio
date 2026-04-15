# CLAUDE.md — Project Intelligence File

## Project Overview
This is a **cross-platform mobile app** targeting Android and iOS, built with **React Native + Expo**.

- **Workspace**: myprojectspace
- **Linear Team**: Ethio Radio (`ea44c753-fb73-4639-ab07-bef9ed516768`)
- **Linear MCP**: `https://mcp.linear.app/mcp`
- **Platform Targets**: Android (API 26+) and iOS (16+)

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | React Native + Expo SDK (latest) |
| Language | TypeScript (strict mode) |
| State | Zustand |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind (Tailwind for RN) |
| Local DB | expo-sqlite |
| Notifications | expo-notifications |
| Testing | Jest + React Native Testing Library |
| CI/CD | EAS Build + EAS Submit |

---

## Project Structure

```
src/
  features/radio/ # Radio streaming feature (screen, hooks, service, utils, store, types)
  store/          # Global Zustand stores
  assets/         # Images, fonts, icons
app/              # Expo Router file-based routes
```

---

## Code Conventions

- **TypeScript** strictly typed; no `any`
- **Components**: Functional only, no class components
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Imports**: Absolute paths via `@/` alias
- **Styles**: NativeWind utility classes preferred over StyleSheet
- **Commits**: Conventional Commits format (`feat:`, `fix:`, `chore:`)

---

## Linear Integration

Issues are tracked in **Linear** under the **Ethio Radio** team. When working on a feature:
1. Reference the Linear issue ID in branch names: `feat/MY-XX-short-description`
2. Reference issue IDs in commit messages: `feat(MY-XX): implement login screen`
3. Claude can create/update Linear issues directly via the connected MCP server.

---

## Key Commands

```bash
# Install
npm install

# Start dev server
npx expo start

# Run on Android
npx expo run:android

# Run on iOS
npx expo run:ios

# Build for production (EAS)
eas build --platform all

# Run tests
npm test

# Lint + type check
npm run lint && npm run type-check
```

---

## Environment Variables

Stored in `.env.local` (never committed). See `.env.example` for required keys.

---

## AI Guidance for Claude

- Always consider **both Android and iOS** platform differences
- Prefer **Expo-managed workflow** over bare React Native unless absolutely necessary
- Check `permissions.md` before suggesting native modules
- Before creating a Linear issue, check if one already exists with `list_issues`
- Follow the 8-step build order in `SKILLS.md` for new features
