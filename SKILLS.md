# SKILLS.md — Development Playbook

## 8-Step Feature Build Order

Follow this sequence for every new feature to ensure quality and consistency:

```
1. PLAN       → Define scope, update/create Linear issue
2. DESIGN     → Sketch component tree, data shape, and API contract
3. STORE      → Define Zustand slice or local state shape
4. SERVICE    → Write data-fetching / persistence logic
5. COMPONENT  → Build UI components (bottom-up: atoms → molecules → screens)
6. HOOK       → Extract logic into custom hooks if reusable
7. TEST       → Unit tests for hooks/utils, integration tests for screens
8. SHIP       → PR → Linear status update → EAS build if needed
```

---

## Platform-Specific Skills

### Android
- Test on **API 26 (Oreo)** as minimum target
- Use `Platform.select()` for OS-specific styles
- Handle back button via `useBackHandler` or Expo Router
- Notification channels required for Android 8+

### iOS
- Test on **iOS 16** as minimum
- Handle safe area insets with `SafeAreaView` or `useSafeAreaInsets()`
- Privacy descriptions required in `app.json` for camera, location, etc.
- Apple Sign In required if offering any social login

---

## Component Patterns

### Screen Template
```tsx
import { View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ExampleScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-4">
        <Text className="text-2xl font-bold">Screen Title</Text>
      </View>
    </SafeAreaView>
  )
}
```

### Zustand Store Template
```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface ExampleState {
  items: string[]
  addItem: (item: string) => void
}

export const useExampleStore = create<ExampleState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
    }),
    { name: 'example-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
)
```

### Custom Hook Template
```ts
import { useState, useEffect } from 'react'

export function useExample(param: string) {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // fetch or compute
    setLoading(false)
  }, [param])

  return { data, loading }
}
```

---

## Linear Issue Workflow

| Status | Meaning |
|---|---|
| Todo | Not started |
| In Progress | Active development |
| In Review | PR open, awaiting review |
| Done | Merged and deployed |

**Label conventions:**
- `feature` — new functionality
- `bug` — defect fix
- `chore` — tooling / config / deps
- `platform:android` / `platform:ios` — platform-specific issue

---

## Testing Checklist

Before marking any issue **Done**:
- [ ] Feature works on Android emulator (API 33)
- [ ] Feature works on iOS simulator (iOS 17)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No lint errors (`npm run lint`)
- [ ] Unit tests pass (`npm test`)
- [ ] Tested on physical device if touch/gesture related
- [ ] Linear issue updated with PR link

---

## EAS Build Quick Reference

```bash
# Development build (for Expo Go replacement)
eas build --profile development --platform all

# Preview build (internal testing)
eas build --profile preview --platform all

# Production build
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```
