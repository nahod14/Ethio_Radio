# permissions.md — Native Modules & Device Permission Registry

> Every native module and device permission used in this app must be listed here.
> Claude must check this file before suggesting new native capabilities.
> To add a new entry, create a Linear issue tagged `chore` first.

---

## ✅ Approved Native Modules

| Module | Purpose | Platform | Expo Managed? | Linear Issue |
|---|---|---|---|---|
| `expo-notifications` | Push notifications | Android + iOS | ✅ Yes | — |
| `expo-sqlite` | Local persistent storage | Android + iOS | ✅ Yes | — |
| `expo-camera` | Camera access | Android + iOS | ✅ Yes | — |
| `expo-image-picker` | Photo library access | Android + iOS | ✅ Yes | — |
| `expo-location` | GPS / location | Android + iOS | ✅ Yes | — |
| `expo-secure-store` | Secure key-value (tokens) | Android + iOS | ✅ Yes | — |
| `expo-file-system` | File read/write | Android + iOS | ✅ Yes | — |
| `react-native-safe-area-context` | Safe area handling | Android + iOS | ✅ Yes | — |
| `react-native-gesture-handler` | Gesture support | Android + iOS | ✅ Yes | — |
| `react-native-reanimated` | Animations | Android + iOS | ✅ Yes | — |

---

## 📋 Device Permissions Required

### Android (`app.json` → `android.permissions`)
```json
[
  "RECEIVE_BOOT_COMPLETED",
  "VIBRATE",
  "USE_BIOMETRIC",
  "USE_FINGERPRINT",
  "CAMERA",
  "READ_EXTERNAL_STORAGE",
  "WRITE_EXTERNAL_STORAGE",
  "ACCESS_FINE_LOCATION",
  "ACCESS_COARSE_LOCATION"
]
```

### iOS (`app.json` → `ios.infoPlist`)
```json
{
  "NSCameraUsageDescription": "Used to capture profile photos and scan content.",
  "NSPhotoLibraryUsageDescription": "Used to select images from your photo library.",
  "NSLocationWhenInUseUsageDescription": "Used to show location-relevant content.",
  "NSUserNotificationsUsageDescription": "Used to send you reminders and updates.",
  "NSFaceIDUsageDescription": "Used for secure biometric authentication."
}
```

---

## 🚫 Modules Requiring Approval Before Use

The following require a Linear issue + team discussion before being added:

- Any **bare workflow ejection** from Expo managed
- **In-app purchases** (`react-native-iap`)
- **Bluetooth** (`react-native-ble-plx`)
- **Background tasks** beyond `expo-background-fetch`
- **Health data** (`react-native-health`)
- **Contacts** (`expo-contacts`)
- **Biometrics** (`expo-local-authentication`) — approved for auth flow only

---

## 🔑 Auth & API Keys

All secrets stored in `.env.local` (gitignored). Required keys:

```
# .env.example
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_LINEAR_API_KEY=your_linear_api_key
```

Never commit actual values. Use `EXPO_PUBLIC_` prefix only for values safe to expose to the client bundle.

---

## 📅 Permission Review Log

| Date | Change | Approved By |
|---|---|---|
| 2026-04-13 | Initial permissions list created | Nahom |
