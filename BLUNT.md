# BLUNT.md — Hard Rules & Guardrails

> This file exists to keep Claude honest and the codebase clean.
> These are non-negotiable constraints. Follow them without exception.

---

## ❌ Never Do This

### Code Quality
- **No `any` type** in TypeScript. If you don't know the type, derive it or use `unknown`.
- **No inline styles** using `StyleSheet.create` unless NativeWind cannot handle it.
- **No hardcoded strings** for user-facing text. Use a constants file or i18n.
- **No `console.log` left in production code.** Use a proper logger utility.
- **No direct `fetch()` calls** inside components. All API calls go through `src/services/`.
- **No mutation of Zustand state outside of store actions.**

### Architecture
- **No business logic in screen components.** Screens compose; hooks and services compute.
- **No cross-store imports** (stores should not depend on each other directly).
- **Do not bypass Expo managed workflow** for a native module unless it's in `permissions.md` as approved.
- **No secrets or API keys in source code.** Ever. Use `.env.local`.

### Git
- **No commits directly to `main`.** All work goes through feature branches.
- **No merge without Linear issue reference** in branch name and commit.
- **No force-push to shared branches.**

---

## ⚠️ Always Do This

### Before Writing Code
- Check if a Linear issue exists. If not, create one.
- Check `SKILLS.md` for the relevant pattern or template.
- Check `permissions.md` before adding a new native module.

### When Writing Components
- Always handle **loading**, **error**, and **empty** states.
- Always add `accessibilityLabel` to interactive elements.
- Always test gesture/touch interactions on **both platforms**.

### When Writing Types
- Always export types from the file they're defined in.
- Always prefer `interface` for object shapes, `type` for unions/primitives.

### Pull Requests
- Always link the Linear issue in the PR description.
- Always include a short summary of what changed and why.
- Always run `npm run lint && npm run type-check && npm test` before pushing.

---

## 📐 Scope Rules

| Scope | Rule |
|---|---|
| Single issue | One PR. Don't bundle unrelated changes. |
| Refactor | Separate PR from feature work. |
| Dependency update | Its own PR with changelog notes. |
| Breaking change | Must update `CHANGELOG.md` and notify team. |

---

## 🚫 Libraries That Are Banned

| Library | Reason | Use Instead |
|---|---|---|
| `moment.js` | Too heavy | `date-fns` |
| `lodash` (full) | Tree-shaking issues | Import specific functions |
| `redux` | Overkill for this project | `zustand` |
| `axios` (unless already installed) | Native `fetch` is sufficient | `fetch` + custom wrapper |
| Any unmaintained library (last commit > 2 years) | Risk | Find active alternative |

---

## AI-Specific Rules (for Claude)

- **Do not suggest adding native modules** not in `permissions.md` without flagging it first.
- **Do not generate placeholder/lorem ipsum code** and call it done. Either implement it or say it's a stub.
- **Do not silently change the tech stack.** If you think a better tool exists, say so and wait for approval.
- **Always check Linear before creating duplicate issues.**
- **When uncertain, ask. Don't guess and ship.**
